import { Component, Type } from '@angular/core';
import { DocumentDialogCustomTemplateComponent } from '../../document-dialog-custom-template.component';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { DocumentPageService } from '../../../services/document-page.service';

@Component({
  selector: 'creative-project-mgt-template',
  styleUrls: ['../global-document-dialog-template.scss', './creative-project-mgt-template.component.scss'],
  templateUrl: './creative-project-mgt-template.component.html',
})
export class CreativeProjectMgtTemplateComponent extends DocumentDialogCustomTemplateComponent {

  static readonly NAME: string = 'creative-project-mgt-template';

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected documentPageService: DocumentPageService,
  ) {
    super(globalDocumentDialogService, documentPageService);
    this.subscribeDialogEvents();
  }

  protected getExcludeHomeViews(): string[] {
    return ['asset-home-view', '3rd-import-home-view', 'package-home-view', 'import-asset-home-view', 'usage-rights-home-view'];
  }
}
