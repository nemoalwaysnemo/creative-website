import { Component, Input, Type, TemplateRef } from '@angular/core';
import { DocumentModel, NuxeoPermission } from '@core/api';
import { Observable, of as observableOf } from 'rxjs';
import { Router } from '@angular/router';
import { GlobalDocumentDialogService, DocumentModelForm } from '../../shared';
import { GLOBAL_DOCUMENT_FORM } from '../../shared/global-document-form';
import { GlobalDocumentDialogSettings } from '../../shared/global-document-dialog';

@Component({
  selector: 'learning-form-button',
  styleUrls: ['./learning-form-button.component.scss'],
  templateUrl: './learning-form-button.component.html',
})
export class LearningFormButtonComponent {

  document: DocumentModel;

  dialogSettings: GlobalDocumentDialogSettings;

  addChildrenPermission$: Observable<boolean> = observableOf(false);

  redirectUrl: string = this.router.url;

  @Input() title: string;

  @Input()
  set type(type: 'Program' ) {
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

  buildRedirectUrl(): string {
    return window.location.href.split('#')[1].split('?')[0];
  }

  private getDialogFormSettings(type: string): GlobalDocumentDialogSettings {
    const components: Type<DocumentModelForm>[] = [];
    switch (type) {
      case 'program':
        components.push(GLOBAL_DOCUMENT_FORM.LEARNING_PROGRAM_FORM);
        break;
      default:
        throw new Error(`unknown document form component for '${type}'`);
    }
    return new GlobalDocumentDialogSettings({ components });
  }

}
