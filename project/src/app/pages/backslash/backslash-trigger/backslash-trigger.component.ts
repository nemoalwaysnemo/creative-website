import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentModel, NuxeoAutomations } from '@core/api';
import { BaseDocumentManageComponent, DocumentPageService } from '@pages/shared';
import { DocumentFormStatus } from '../../shared/document-form/document-form.interface';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

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
    buttonGroup: [
      {
        label: 'Create',
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

  private currentDocument: DocumentModel;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
  ) {
    super(activatedRoute, documentPageService);
  }

  onInit(): void {
    const subscription = this.searchCurrentDocument(this.getCurrentDocumentSearchParams()).subscribe((doc: DocumentModel) => {
      this.currentDocument = doc;
    });
    this.subscription.add(subscription);
  }

  isButtonDisabled(): boolean {
    return this.fetching || !this.currentDocument || !this.url.nativeElement.value;
  }

  fetchSite(): void {
    this.fetching = true;
    const link = this.url.nativeElement.value;
    this.documentPageService.operation(NuxeoAutomations.GetWebPageElement, { url: link }, this.currentDocument.uid, { schemas: '*' }).subscribe((doc: DocumentModel) => {
      this.document = this.updateBackslashTriggerProperties(this.currentDocument, doc);
      this.fetching = false;
    });
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
    return new DocumentModel({ path: doc.path, properties });
  }

}
