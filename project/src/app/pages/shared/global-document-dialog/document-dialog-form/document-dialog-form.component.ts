import { Component, ComponentFactoryResolver } from '@angular/core';
import { DocumentModelForm } from '../../global-document-form/global-document-form.component';
import { DocumentDialogContainerComponent } from '../document-dialog-container.component';
import { DocumentFormEvent } from '../../document-form/document-form.interface';
import { GlobalDocumentDialogService } from '../global-document-dialog.service';
import { DocumentPageService } from '../../services/document-page.service';
import { timer } from 'rxjs';

@Component({
  selector: 'document-dialog-form',
  styleUrls: ['../document-dialog-template/global-document-dialog-template.scss'],
  templateUrl: './document-dialog-form.component.html',
})
export class DocumentDialogFormComponent extends DocumentDialogContainerComponent implements DocumentModelForm {

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
  ) {
    super(globalDocumentDialogService, documentPageService, componentFactoryResolver);
  }

  protected onInit(): void {
    super.createComponent(this.component, this.document, this.dialogSettings);
    this.subscribeDialogEvents();
  }

  protected subscribeDialogEvents(): void {
    // this.subscribeDialogBuiltInEvents();
    this.subscribeComponentEvents();
  }

  protected subscribeComponentEvents(): void {
    if (this.dynamicComponent) {
      this.dynamicComponent.instance.callback.subscribe((e: DocumentFormEvent) => {
        this.globalDocumentDialogService.triggerEvent({ name: `Form${e.action}`, type: 'callback', messageType: e.messageType, messageContent: e.messageContent, options: { doc: e.doc } });
        if (e.action === 'Canceled') {
          this.close();
        } else if (['Created', 'Updated'].includes(e.action)) {
          this.documentPageService.updateCurrentDocument(e.doc);
          this.documentPageService.googleAnalyticsTrackEvent({
            event_category: 'Document',
            event_action: `Document ${e.action}`,
            event_label: `${e.action} - ${e.doc.title}`,
            'dimensions.docId': e.doc.uid,
            'dimensions.docTitle': e.doc.title,
            'dimensions.docType': e.doc.type,
            'dimensions.userEvent': `Document ${e.action}`,
          });
          timer(2000).subscribe(_ => {
            this.close();
            this.refresh(e.getRedirectUrl(e.doc));
          });
        }
      });
    }
  }
}
