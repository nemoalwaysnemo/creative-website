import { Component, Input, Type, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentModel, NuxeoPermission } from '@core/api';
import { Observable, of as observableOf } from 'rxjs';
import { GlobalDocumentDialogService, DocumentModelForm } from '../../../shared';
import { GLOBAL_DOCUMENT_FORM } from '../../../shared/global-document-form';
import { GlobalDocumentDialogSettings } from '../../../shared/global-document-dialog';

@Component({
  selector: 'creative-ring-form-button',
  styleUrls: ['./creative-ring-form-button.component.scss'],
  templateUrl: './creative-ring-form-button.component.html',
})
export class CreativeRingFormButtonComponent {

  document: DocumentModel;

  dialogSettings: GlobalDocumentDialogSettings;

  addChildrenPermission$: Observable<boolean> = observableOf(false);

  redirectUrl: string = this.router.url;

  @Input() title: string;

  @Input()
  set type(type: string) {
    this.dialogSettings = this.getDialogFormSettings(type);
  }

  @Input()
  set parent(doc: DocumentModel) {
    if (doc) {
      this.document = doc;
      this.addChildrenPermission$ = doc.hasPermission(NuxeoPermission.AddChildren);
    }
  }

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    private router: Router,
  ) {
  }

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog, { closeOnBackdropClick: false });
  }

  private getDialogFormSettings(type: string): GlobalDocumentDialogSettings {
    const components: Type<DocumentModelForm>[] = [];
    switch (type) {
      case 'collection':
        components.push(GLOBAL_DOCUMENT_FORM.CREATIVE_RING_COLLECTION_FORM);
        break;
      default:
        throw new Error(`unknown document form component for '${type}'`);
    }
    return new GlobalDocumentDialogSettings({
      containerType: 'middle-dialog-container',
      components,
      metadata: {
        formSettings: { formType: 'new' },
      },
    });
  }

}
