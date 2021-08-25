import { Component, Input, Type, TemplateRef } from '@angular/core';
import { DocumentModel, NuxeoPermission } from '@core/api';
import { Observable, of as observableOf } from 'rxjs';
import { GlobalDocumentDialogService, DocumentModelForm } from '../../shared';
import { GLOBAL_DOCUMENT_FORM } from '../../shared/global-document-form';
import { GlobalDocumentDialogSettings } from '../../shared/global-document-dialog';

@Component({
  selector: 'biz-dev-form-button',
  styleUrls: ['./biz-dev-form-button.component.scss'],
  templateUrl: './biz-dev-form-button.component.html',
})
export class BizDevFormButtonComponent {

  document: DocumentModel;

  dialogSettings: GlobalDocumentDialogSettings;

  addChildrenPermission$: Observable<boolean> = observableOf(false);

  @Input() title: string;

  @Input()
  set type(type: 'case' | 'case asset' | 'thought' | 'thought asset' | 'opportunity' | 'opportunity asset') {
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
    this.globalDocumentDialogService.open(dialog, { closeOnBackdropClick: false });
  }

  buildRedirectUrl(): string {
    return window.location.href.split('#')[1].split('?')[0];
  }

  private getFormSettings(type: string): GlobalDocumentDialogSettings {
    const components: Type<DocumentModelForm>[] = [];
    switch (type) {
      case 'case':
        components.push(GLOBAL_DOCUMENT_FORM.BIZ_DEV_CASE_STUDY_FOLDER_FORM);
        break;
      case 'case asset':
        components.push(GLOBAL_DOCUMENT_FORM.BIZ_DEV_CASE_STUDY_ASSET_FORM);
        break;
      case 'thought':
        components.push(GLOBAL_DOCUMENT_FORM.BIZ_DEV_THOUGHT_FOLDER_FORM);
        break;
      case 'thought asset':
        components.push(GLOBAL_DOCUMENT_FORM.BIZ_DEV_THOUGHT_ASSET_FORM);
        break;
      case 'opportunity':
        components.push(GLOBAL_DOCUMENT_FORM.BIZ_DEV_OPPORTUNITY_FOLDER_FORM);
        break;
      case 'opportunity asset':
        components.push(GLOBAL_DOCUMENT_FORM.BIZ_DEV_OPPORTUNITY_ASSET_FORM);
        break;
      default:
        throw new Error(`unknown document form component for '${type}'`);
    }
    return new GlobalDocumentDialogSettings({ components });
  }

}
