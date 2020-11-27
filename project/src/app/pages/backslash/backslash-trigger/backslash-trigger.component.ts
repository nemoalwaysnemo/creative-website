import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentModel, NuxeoAutomations } from '@core/api';
import { BaseDocumentManageComponent, DocumentPageService } from '@pages/shared';
import { DocumentFormEvent, DocumentFormStatus } from '../../shared/document-form/document-form.interface';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE, Environment } from '@environment/environment';
import { NuxeoDocumentUrl } from '@core/services/helpers';

@Component({
  selector: 'backslash-trigger',
  styleUrls: ['./backslash-trigger.component.scss'],
  templateUrl: './backslash-trigger.component.html',
})
export class BackslashTriggerComponent extends BaseDocumentManageComponent {

  @ViewChild('url', { static: true, read: ElementRef }) url: ElementRef<HTMLTextAreaElement>;

  fetching: boolean = false;

  triggerFormSettings: any = {
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

  private imageLimit: number = 5;

  private targetDocument: DocumentModel;

  private imageDocument: DocumentModel;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
  ) {
    super(activatedRoute, documentPageService);
  }

  onInit(): void {
    const subscription = this.searchCurrentDocument(this.getCurrentDocumentSearchParams()).subscribe((doc: DocumentModel) => {
      this.targetDocument = doc;
    });
    this.subscription.add(subscription);
  }

  isButtonDisabled(): boolean {
    return this.fetching || !this.targetDocument || !this.url.nativeElement.value;
  }

  fetchSite(): void {
    this.fetching = true;
    const link = this.url.nativeElement.value;
    this.documentPageService.operation(NuxeoAutomations.GetWebPageElement, { url: link, imageLimit: this.imageLimit }, this.targetDocument.uid, { schemas: '*' }).subscribe((doc: DocumentModel) => {
      this.document = this.updateBackslashTriggerProperties(this.targetDocument, doc);
      this.imageDocument = doc;
      this.fetching = false;
    });
  }

  onCallback(e: DocumentFormEvent): void {
    if (['Created', 'Updated'].includes(e.action)) {
      this.document = this.updateBackslashTriggerProperties(e.doc, this.imageDocument);
      if (e.action === 'Created') {
        this.triggerFormSettings = Object.assign({}, this.triggerFormSettings, {
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
    }
    if (e.button === 'open-trigger' && this.document) {
      this.documentPageService.openNewTab(NuxeoDocumentUrl(this.document.uid));
    }
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path_eq: NUXEO_PATH_INFO.BACKSLASH_TRIGGER_FOLDER_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_TRIGGER_SUB_FOLDER_YTPE,
    };
  }

  private updateBackslashTriggerProperties(doc: DocumentModel, target: DocumentModel): DocumentModel {
    const properties = Object.assign({}, doc.properties, {
      'web-page-element:page-images': target.get('web-page-element:page-images'),
      'app_Edges:URL': target.get('web-page-element:page-url'),
      'dc:title': target.title,
    });
    return new DocumentModel({ uid: doc.uid, path: doc.path, properties }, doc.options);
  }

}
