import { Component } from '@angular/core';
import { DocumentDialogCustomTemplateComponent } from '../../document-dialog-custom-template.component';
import { DocumentPageService } from '../../../services/document-page.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';

@Component({
  selector: 'creative-campaign-mgt-template',
  styleUrls: ['../global-document-dialog-template.scss', './creative-campaign-mgt-template.component.scss'],
  templateUrl: './creative-campaign-mgt-template.component.html',
})
export class CreativeCampaignMgtTemplateComponent extends DocumentDialogCustomTemplateComponent {

  static readonly NAME: string = 'creative-campaign-mgt-template';

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected documentPageService: DocumentPageService,
  ) {
    super(globalDocumentDialogService, documentPageService);
    this.subscribeDialogEvents();
  }
  protected getExcludeHomeViews(): string[] {
    return ['asset-home-view'];
  }
}
