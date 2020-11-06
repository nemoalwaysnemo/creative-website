import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentModel, NuxeoAutomations } from '@core/api';
import { BaseDocumentManageComponent, DocumentPageService } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'backslash-trigger',
  styleUrls: ['./backslash-trigger.component.scss'],
  templateUrl: './backslash-trigger.component.html',
})
export class BackslashTriggerComponent extends BaseDocumentManageComponent {

  image: string = '';

  formSettings: any = {
    enableLayoutRight: false,
    buttonGroup: [
      {
        label: 'Create',
        name: 'save',
        type: 'save',
      },
    ],
  };

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
  ) {
    super(activatedRoute, documentPageService);
  }

  onInit(): void {
    const subscription = this.searchCurrentDocument(this.getCurrentDocumentSearchParams()).subscribe();
    this.subscription.add(subscription);
  }

  fetchSite(): void {
    const link = 'https://www.ifanr.com/1371214';
    this.documentPageService.operation(NuxeoAutomations.GetWebPageElement, { url: link }, this.document.uid, { schemas: '*' }).subscribe((doc: DocumentModel) => {
      this.document = doc;
      const images = doc.get('web-page-element:page-images');
      this.image = images[0].base64;
      // console.log(doc.get('web-page-element:page-url'), doc.get('web-page-element:page-images'));
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

}
