import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NuxeoDocumentUrl } from '@core/services/helpers';
import { DocumentModel, NuxeoAutomations, NuxeoUploadResponse } from '@core/api';
import { BaseDocumentManageComponent, DocumentPageService } from '@pages/shared';
import { DocumentFormEvent, DocumentFormStatus } from '../../shared/document-form/document-form.interface';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';
import { Observable, Subject, zip } from 'rxjs';
import { concatMap, filter, share, tap } from 'rxjs/operators';

@Component({
  selector: 'backslash-trigger',
  styleUrls: ['./backslash-trigger.component.scss'],
  templateUrl: './backslash-trigger.component.html',
})
export class BackslashTriggerComponent extends BaseDocumentManageComponent {

  @ViewChild('url', { static: true, read: ElementRef }) url: ElementRef<HTMLTextAreaElement>;

  noImages: boolean = false;

  fetching: boolean = false;

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

  private readonly cacheKey: string = 'Backslash-Trigger-Extension-Form';

  private event$: Subject<{ key: string, data: any }> = new Subject<any>();

  private imageItems: any[] = [];

  private imageLimit: number = 3;

  private targetDocument: DocumentModel;

  private imageDocument: DocumentModel;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
  ) {
    super(activatedRoute, documentPageService);
    this.onPageInitialized();
    this.onInputUrlChanged();
    this.performActiveTabUrl();
  }

  onInit(): void {
    this.getDataFromStorage(this.cacheKey);
  }

  urlChanged(event: any): void {
    this.noImages = false;
  }

  isFormDisabled(): boolean {
    return false;
    // return this.fetching || !this.targetDocument;
  }

  fetchSite(): void {
    this.inputUrl = this.url.nativeElement.value;
    this.event$.next({ key: 'inputUrl', data: this.inputUrl });
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
      this.clearStorage(this.cacheKey);
    } else if (['UploadFilesChanged', 'onBlur'].includes(e.action) && !e.status.submitted && e.formValue) {
      this.setDataToStorage(this.cacheKey, e.formValue);
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
    // });
  }

  private onInputUrlChanged(): void {
    const subscription = this.onEvent('inputUrl').pipe(
      tap(_ => {
        this.fetching = true;
        this.noImages = false;
      }),
      concatMap((event: { key: string, data: any }) => this.documentPageService.operation(NuxeoAutomations.GetWebPageElement, { url: event.data, imageLimit: this.imageLimit }, this.targetDocument.uid, { schemas: '*' })),
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
      this.onEvent(this.cacheKey),
      this.searchCurrentDocument(this.getCurrentDocumentSearchParams()),
    ).subscribe(([event, doc]: [{ key: string, data: any }, DocumentModel]) => {
      this.targetDocument = doc;
      const properties = event.data[this.cacheKey];
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
          value[key] = (formValue[key] || []).map((i: NuxeoUploadResponse) => i.item).map((i: any) => i.file);
          this.imageItems = value[key];
        } else {
          value[key] = formValue[key];
        }
      }
    }
    return value;
  }

  private setDataToStorage(key: string, value: any): void {
    const formValue = this.buildFormValue(value);
    const data = {};
    data[key] = formValue;
    // chrome.storage.local.set(data, () => {
    console.log('set data to storage', formValue);
    // });
  }

  private getDataFromStorage(key: string): void {
    // chrome.storage.local.get(key, (data: any) => {
    const data = {};
    this.event$.next({ key, data });
    // });
  }

  private clearStorage(key: string): void {
    // chrome.storage.local.get(null, function (data) { console.info(data) });
    // chrome.storage.local.remove(key);
  }

  private onEvent(key?: string): Observable<{ key: string, data: any }> {
    return this.event$.pipe(filter((e: { key: string, data: any }) => key ? e.key === key : true)).pipe(share());
  }

}
