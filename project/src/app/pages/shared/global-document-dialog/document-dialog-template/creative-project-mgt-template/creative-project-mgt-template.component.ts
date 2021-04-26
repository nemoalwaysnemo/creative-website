import { Component } from '@angular/core';
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
    this.subscribeEvents();
  }

  protected subscribeEvents(): void {
    this.documentPageService.onEventType('creative-campaign-project-mgt').pipe(
      filter((event: GlobalEvent) => event.data && event.data.view && event.data.type === 'dialog'),
    ).subscribe((event: GlobalEvent) => {
      this.selectView(event.data.view, null, event.data.settings || {});
    });
  }

}
