import { Component, ComponentFactoryResolver } from '@angular/core';
import { DocumentDialogContainerComponent } from '../document-dialog-container.component';
import { GlobalDocumentDialogService } from '../global-document-dialog.service';
import { DocumentModelForm } from '../../global-document-form/global-document-form.component';
import { DocumentPageService } from '../../services/document-page.service';
import { DocumentFormEvent } from '../../document-form/document-form.interface';
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
    super.createComponent(this.component);
    this.subscribeComponentEvent();
  }

  protected subscribeComponentEvent(): void {
    if (this.dynamicComponent) {
      this.dynamicComponent.instance.callback.subscribe((e: DocumentFormEvent) => {
        this.globalDocumentDialogService.triggerEvent({ name: `Form${e.action}`, type: 'callback', messageType: e.messageType, messageContent: e.messageContent, options: { doc: e.doc } });
        if (e.action === 'Canceled') {
          this.close();
        } else if (['Created', 'Updated'].includes(e.action)) {
          this.documentPageService.updateCurrentDocument(e.doc);
          timer(2000).subscribe(_ => {
            this.close();
            this.refresh(e.getRedirectUrl(e.doc));
          });
        }
      });
    }
  }
}
