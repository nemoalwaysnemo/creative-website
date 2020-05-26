import { Component, Input, Type, TemplateRef } from '@angular/core';
import { DocumentModel, NuxeoPermission } from '@core/api';
import { Observable, of as observableOf } from 'rxjs';
import { GlobalDocumentDialogService, DocumentModelForm } from '../../shared';
import { GLOBAL_DOCUMENT_FORM } from '../../shared/global-document-form';
import { GlobalDocumentDialogSettings } from '../../shared/global-document-dialog/global-document-dialog.interface';

@Component({
  selector: 'innovation-form-button',
  styleUrls: ['./innovation-form-button.component.scss'],
  templateUrl: './innovation-form-button.component.html',
})
export class InnovationFormButtonComponent {

  document: DocumentModel;

  dialogSettings: GlobalDocumentDialogSettings;

  addChildrenPermission$: Observable<boolean> = observableOf(false);

  @Input() title: string;

  @Input()
  set type(type: 'Next' | 'Things to Steal' | '10x') {
    this.dialogSettings = this.getFormSettings(type);
  }

  @Input()
  set parent(doc: DocumentModel) {
    if (doc) {
      this.document = doc;
      this.addChildrenPermission$ = doc.hasPermission(NuxeoPermission.AddChildren);
    }
  }

  constructor(protected globalDocumentDialogService: GlobalDocumentDialogService) {
  }

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog);
  }

  buildRedirectUrl(): string {
    return window.location.href.split('#')[1].split('?')[0];
  }

  private getFormSettings(type: string): GlobalDocumentDialogSettings {
    const components: Type<DocumentModelForm>[] = [];
    switch (type) {
      case 'Next':
        components.push(GLOBAL_DOCUMENT_FORM.BIZ_DEV_CASE_STUDY_FOLDER_FORM);
        break;
      case 'Things to Steal':
        components.push(GLOBAL_DOCUMENT_FORM.BIZ_DEV_CASE_STUDY_ASSET_FORM);
        break;
      case '10x':
        components.push(GLOBAL_DOCUMENT_FORM.BIZ_DEV_THOUGHT_FOLDER_FORM);
        break;
      default:
        throw new Error(`unknown document form component for '${type}'`);
    }
    return new GlobalDocumentDialogSettings({ components });
  }

}
