import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { DocumentModel, NuxeoAutomations, NuxeoRequestOptions, NuxeoUploadResponse } from '@core/api';
import { BaseDocumentManageComponent, DocumentPageService, GlobalEvent } from '@pages/shared';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { IndexedDBService } from '@core/services';
import { from, Observable, zip } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators';
import { DocumentFormEvent } from '../../shared/document-form/document-form.interface';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';
import { NuxeoDocumentUrl } from '@core/services/helpers';

@Component({
  selector: 'backslash-trigger',
  styleUrls: ['./backslash-trigger.component.scss'],
  templateUrl: './backslash-trigger.component.html',
})
export class BackslashTriggerComponent extends BaseDocumentManageComponent implements AfterViewInit {

  @ViewChild('url', { static: true, read: ElementRef }) url: ElementRef<HTMLTextAreaElement>;

  noImages: boolean = false;

  fetching: boolean = false;

  enableOpenTriggerButton: boolean = false;

  enableDiscardDraftButton: boolean = false;

  enableCloseWindowButton: boolean = false;

  inputUrl: string = '';

  formSettings: any = {
    actionOptions: { schemas: '*' },
    enableLayoutRight: true,
    formMode: 'create',
    showMessageBeforeSave: false,
    buttonGroup: [
      {
        label: 'SUBMIT',
        name: 'save',
        type: 'save',
      },
    ],
  };

  private requestedUrl: string;

  private imageLimit: number = 3;

  private targetDocument: DocumentModel;

  private imageDocument: DocumentModel;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected indexedDBService: IndexedDBService,
    protected documentPageService: DocumentPageService,
  ) {
    super(activatedRoute, documentPageService);
    this.checkUserPreference();
    this.checkRequestedUrl();
    this.onPageInitialized();
    this.onInputUrlChanged();
  }

  onInit(): void {
  }

  ngAfterViewInit(): void {
    this.getStoredDataByUrl('pageInitialized', this.inputUrl);
  }

  onOpenTrigger(): void {
    if (this.document) {
      window.open(NuxeoDocumentUrl(this.document.uid), '_blank');
    }
  }

  onDiscardDraft(): void {
    this.discardDraft(this.inputUrl);
  }

  onCloseWindow(): void {
    window.close();
  }

  urlChanged(event: any): void {
    this.inputUrl = this.url.nativeElement.value;
    this.noImages = false;
  }

  isFormDisabled(): boolean {
    return this.fetching || !this.targetDocument;
  }

  onKeyEnter(event: KeyboardEvent): void {
    this.fetchSite();
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  fetchSite(): void {
    if (this.inputUrl && ['http://', 'https://'].some(p => this.inputUrl.startsWith(p))) {
      this.getStoredDataByUrl('inputUrlChanged', this.inputUrl);
    }
  }

  onCallback(e: DocumentFormEvent): void {
    if (['Created', 'Updated'].includes(e.action)) {
      this.document = this.updateProperties(e.doc, this.imageDocument);
      if (e.action === 'Created') {
        this.formSettings = Object.assign({}, this.formSettings, {
          formMode: 'edit',
          buttonGroup: [
            {
              label: 'RE-SUBMIT',
              name: 'save',
              type: 'save',
            },
          ],
        });
      }
      this.noImages = false;
      this.discardDraft(this.inputUrl);
      this.enableOpenTriggerButton = true;
      this.enableDiscardDraftButton = false;
      this.enableCloseWindowButton = true;
    } else if (['UploadFilesChanged', 'onBlur'].includes(e.action) && !e.status.submitted && e.formValue && e.ngFormSettings.formMode === 'create') {
      this.setDataToStorage(this.inputUrl, e.formValue);
    }
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path_eq: NUXEO_PATH_INFO.BACKSLASH_TRIGGER_FOLDER_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_TRIGGER_SUB_FOLDER_TYPE,
    };
  }

  private updateProperties(doc: DocumentModel, imageDoc: DocumentModel): DocumentModel {
    const properties = Object.assign({}, doc.properties, {
      'web-page-element:page-images': imageDoc.get('web-page-element:page-images') || imageDoc.get('galleryUpload'),
      'app_Edges:URL': imageDoc.get('web-page-element:page-url'),
      'dc:title': imageDoc.title,
    });
    return new DocumentModel({ uid: doc.uid, properties }, doc.options);
  }

  private hasPageImages(doc: DocumentModel): boolean {
    return doc.properties['web-page-element:page-images'] && doc.properties['web-page-element:page-images'].length > 0;
  }

  private onInputUrlChanged(): void {
    const subscription = this.documentPageService.onEvent('inputUrlChanged').pipe(
      tap(_ => {
        this.fetching = true;
        this.noImages = false;
      }),
      concatMap((event: GlobalEvent) => this.documentPageService.operation(NuxeoAutomations.GetWebPageElement, { url: this.inputUrl, imageLimit: this.imageLimit }, this.targetDocument.uid, { schemas: '*' })),
    ).subscribe((imageDoc: DocumentModel) => {
      this.document = this.updateProperties(this.targetDocument, imageDoc);
      this.noImages = !this.hasPageImages(this.document);
      this.imageDocument = imageDoc;
      this.fetching = false;
    });
    this.subscription.add(subscription);
  }

  private onPageInitialized(): void {
    const subscription = zip(
      this.documentPageService.onEvent('pageInitialized'),
      this.searchCurrentDocument(this.getCurrentDocumentSearchParams(), new NuxeoRequestOptions().setOptions('schemas', [])),
    ).subscribe(([event, doc]: [GlobalEvent, DocumentModel]) => {
      this.targetDocument = doc;
      const properties = event.data;
      if (properties && this.inputUrl === properties['app_Edges:URL']) {
        this.document = new DocumentModel({ uid: doc.uid, path: doc.path, properties }, doc.options);
        this.imageDocument = new DocumentModel({ uid: doc.uid, path: doc.path, properties });
      }
      if (this.requestedUrl) {
        this.fetchSite();
      }
    });
    this.subscription.add(subscription);
  }

  private checkRequestedUrl(): void {
    this.activatedRoute.queryParamMap.subscribe((map: ParamMap) => {
      this.requestedUrl = map.get('requestedUrl');
      this.inputUrl = this.requestedUrl ? this.requestedUrl : this.inputUrl;
    });
  }

  private checkUserPreference(): void {
    this.getUserSimplePreference().subscribe((preference: any) => {
      if (!this.isUserPreferenceValid(preference.value || {})) {
        this.documentPageService.redirect('/p/backslash/trigger/preference');
      }
    });
  }

  private getUserSimplePreference(): Observable<any> {
    return this.documentPageService.getSimplePreference('backslash-chrome-user-country, backslash-chrome-user-agency, backslash-chrome-user-city, backslash-chrome-user-spotter-handle');
  }

  private buildFormValue(formValue: any): any {
    const value = {};
    for (const key in formValue) {
      if (Object.prototype.hasOwnProperty.call(formValue, key)) {
        if (key === 'galleryUpload') {
          value[key] = (formValue[key] || []).map((i: NuxeoUploadResponse) => i.item).map((i: any) => i.getFile());
        } else {
          value[key] = formValue[key];
        }
      }
    }
    return value;
  }

  private getStoredDataByUrl(name: string, url: string): void {
    if (url) {
      this.getDataFromStorage(url).subscribe((rows: any) => {
        const data = rows.length > 0 ? rows[0] : {};
        this.enableDiscardDraftButton = rows.length > 0;
        this.documentPageService.triggerEvent(new GlobalEvent({ name, data, url, type: name }));
      });
    } else {
      this.documentPageService.triggerEvent(new GlobalEvent({ name, url, type: name }));
    }
  }

  private setDataToStorage(url: string, value: any): void {
    this.getDataFromStorage(url).subscribe((data: any) => {
      const formValue = this.buildFormValue(value);
      if (!formValue['app_Edges:URL']) {
        formValue['app_Edges:URL'] = url;
      }
      if (data.length === 0) {
        this.indexedDBService.add('triggers', formValue);
      } else {
        const row = data.shift();
        this.indexedDBService.update('triggers', row.id, formValue);
      }
      this.enableDiscardDraftButton = true;
    });
  }

  private getDataFromStorage(url: string): Observable<any> {
    return from(this.indexedDBService.filter('triggers', (value: any) => value['app_Edges:URL'] === url).toArray());
  }

  private isUserPreferenceValid(preference: any = {}): boolean {
    const settings = ['backslash-chrome-user-country', 'backslash-chrome-user-agency'].map((k: string) => preference[k]);
    return settings.every((v: any) => v && v !== '' && v !== 'null' && v.length !== 0);
  }

  private discardDraft(url: string): void {
    this.indexedDBService.filter('triggers', (value: any) => value['app_Edges:URL'] === url).delete();
    this.enableDiscardDraftButton = false;
    // chrome.storage.local.get(null, function (data) { console.info(data) });
  }

}
