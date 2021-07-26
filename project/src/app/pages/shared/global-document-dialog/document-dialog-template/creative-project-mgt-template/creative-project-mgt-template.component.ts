import { Component, Type } from '@angular/core';
import { DocumentDialogCustomTemplateComponent } from '../../document-dialog-custom-template.component';
import { DocumentPageService, GlobalEvent } from '../../../services/document-page.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { filter } from 'rxjs/operators';

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

  backToMainView(componentName: string = null, component: Type<any> = null, metadata?: any): void {
    this.globalDocumentDialogService.backToMainView(componentName, metadata || this.getDialogSettings(), component);
  }

}
