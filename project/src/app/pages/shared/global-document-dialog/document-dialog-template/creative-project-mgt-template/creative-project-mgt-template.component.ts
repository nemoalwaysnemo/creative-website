import { Component } from '@angular/core';
import { DocumentModel } from '@core/api';
import { DocumentDialogCustomTemplateComponent } from '../../document-dialog-custom-template.component';
import { DocumentPageService } from '../../../services/document-page.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';

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
  }

}
