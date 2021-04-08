import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { DocumentModel, NuxeoAutomations, NuxeoUploadResponse } from '@core/api';
import { BaseDocumentManageComponent, DocumentPageService } from '@pages/shared';
import { ActivatedRoute } from '@angular/router';
import { IndexedDBService } from '@core/services';
import { from, Observable, Subject, zip } from 'rxjs';
import { concatMap, filter, share, tap } from 'rxjs/operators';
import { DocumentFormEvent, DocumentFormStatus } from '../../shared/document-form/document-form.interface';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'backslash-trigger',
  styleUrls: ['./backslash-trigger.component.scss'],
  templateUrl: './backslash-trigger.component.html',
})
export class BackslashTriggerComponent extends BaseDocumentManageComponent implements AfterViewInit {

  @ViewChild('url', { static: true, read: ElementRef }) url: ElementRef<HTMLTextAreaElement>;

  noImages: boolean = false;

  fetching: boolean = false;

  hasDraft: boolean = false;

  inputUrl: string = '';

  formSettings: any = {
    actionOptions: { schemas: '*' },
    enableLayoutRight: false,
    formMode: 'create',
    buttonGroup: [
      {
        label: 'SUBMIT',
        name: 'save',
        type: 'save',
      },
    ],
  };

  userFormSettings: any = {
    enableLayoutRight: false,
    buttonGroup: [
      {
        label: 'Save',
        name: 'user-preference',
        type: 'custom',
        disabled: (status: DocumentFormStatus) => status.disableSaveButton(),
      },
    ],
  };

  userDocument: DocumentModel = new DocumentModel();

  private event$: Subject<{ event: string, data: any }> = new Subject<any>();

  private imageItems: any[] = [];

  private imageLimit: number = 3;

  private targetDocument: DocumentModel;

  private imageDocument: DocumentModel;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected indexedDBService: IndexedDBService,
    protected documentPageService: DocumentPageService,
  ) {
    super(activatedRoute, documentPageService);
    this.onPageInitialized();
    this.onInputUrlChanged();
    this.performActiveTabUrl();
  }

  onInit(): void {
  }

  ngAfterViewInit(): void {
    this.inputUrl = this.url.nativeElement.value;
    this.getStoredDataByUrl('pageInitialized', this.inputUrl);
  }

  onDiscardDraft(): void {
    this.discardDraft(this.inputUrl);
  }

  urlChanged(event: any): void {
    this.inputUrl = this.url.nativeElement.value;
    this.noImages = false;
  }

  isFormDisabled(): boolean {
    return this.fetching || !this.targetDocument;
  }

  fetchSite(): void {
    this.getStoredDataByUrl('inputUrlChanged', this.inputUrl);
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
            {
              label: 'OPEN TRIGGER',
              name: 'open-trigger',
              type: 'custom',
            },
          ],
        });
      }
      this.noImages = false;
      this.discardDraft(this.inputUrl);
    } else if (['UploadFilesChanged', 'onBlur'].includes(e.action) && !e.status.submitted && e.formValue) {
      this.setDataToStorage(this.inputUrl, e.formValue);
    }
    if (e.button === 'open-trigger' && this.document) {
      // chrome.tabs.create({ url: NuxeoDocumentUrl(this.document.uid) });
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

  private updateImageItems(imageDoc: DocumentModel): DocumentModel {
    if (this.imageItems && this.imageItems.length > 0) {
      imageDoc.properties['web-page-element:page-images'] = this.imageItems.concat(imageDoc.properties['web-page-element:page-images']);
      this.imageItems.length = 0;
    }
    return imageDoc;
  }

  private updateProperties(doc: DocumentModel, imageDoc: DocumentModel): DocumentModel {
    const properties = Object.assign({}, doc.properties, {
      'web-page-element:page-images': imageDoc.get('web-page-element:page-images'),
      'app_Edges:URL': imageDoc.get('web-page-element:page-url'),
      'dc:title': imageDoc.title,
    });
    return new DocumentModel({ uid: doc.uid, path: doc.path, properties }, doc.options);
  }

  private hasPageImages(doc: DocumentModel): boolean {
    return doc.properties['web-page-element:page-images'] && doc.properties['web-page-element:page-images'].length > 0;
  }

  private performActiveTabUrl(): void {
    // chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any) => {
    //   this.inputUrl = tabs ? tabs[0].url : this.inputUrl;
    //   this.getDataFromStorage(this.inputUrl);
    // });
  }

  private onInputUrlChanged(): void {
    const subscription = this.onEvent('inputUrlChanged').pipe(
      tap(_ => {
        this.fetching = true;
        this.noImages = false;
      }),
      concatMap((event: { event: string, data: any }) => this.documentPageService.operation(NuxeoAutomations.GetWebPageElement, { url: this.inputUrl, imageLimit: this.imageLimit }, this.targetDocument.uid, { schemas: '*' })),
    ).subscribe((doc: DocumentModel) => {
      const imageDoc = this.updateImageItems(doc);
      this.document = this.updateProperties(this.targetDocument, imageDoc);
      this.noImages = !this.hasPageImages(this.document);
      this.imageDocument = imageDoc;
      this.fetching = false;
    });
    this.subscription.add(subscription);
  }

  private onPageInitialized(): void {
    const subscription = zip(
      this.onEvent('pageInitialized'),
      this.searchCurrentDocument(this.getCurrentDocumentSearchParams()),
    ).subscribe(([event, doc]: [{ event: string, data: any }, DocumentModel]) => {
      this.targetDocument = doc;
      const properties = event.data;
      if (properties && this.inputUrl === properties['app_Edges:URL']) {
        this.document = new DocumentModel({ path: doc.path, properties }, doc.options);
        this.imageDocument = new DocumentModel({ path: doc.path, properties }, doc.options);
      }
    });
    this.subscription.add(subscription);
  }

  private buildFormValue(formValue: any): any {
    const value = {};
    for (const key in formValue) {
      if (Object.prototype.hasOwnProperty.call(formValue, key)) {
        if (key === 'galleryUpload') {
          value[key] = (formValue[key] || []).map((i: NuxeoUploadResponse) => i.item).map((i: any) => i.getFile());
          this.imageItems = value[key];
        } else {
          value[key] = formValue[key];
        }
      }
    }
    return value;
  }

  private getStoredDataByUrl(event: string, url: string): void {
    if (url) {
      this.getDataFromStorage(url).subscribe((rows: any) => {
        const data = rows.length > 0 ? rows[0] : {};
        this.hasDraft = rows.length > 0;
        this.event$.next({ event, data });
      });
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
      this.hasDraft = true;
    });
  }

  private getDataFromStorage(url: string): Observable<any> {
    return from(this.indexedDBService.filter('triggers', (value: any) => value['app_Edges:URL'] === url).toArray());
  }

  private discardDraft(url: string): void {
    this.indexedDBService.filter('triggers', (value: any) => value['app_Edges:URL'] === url).delete();
    this.hasDraft = false;
    // chrome.storage.local.get(null, function (data) { console.info(data) });
  }

  private onEvent(event?: string): Observable<{ event: string, data: any }> {
    return this.event$.pipe(filter((e: { event: string, data: any }) => event ? e.event === event : true)).pipe(share());
  }

}
