import { Component, Input, Type, TemplateRef } from '@angular/core';
import { DocumentModel, NuxeoPermission } from '@core/api';
import { Observable, of as observableOf } from 'rxjs';
import { GlobalDocumentDialogService, DocumentModelForm } from '../../shared';
import { GLOBAL_DOCUMENT_FORM } from '../../shared/global-document-form';
import { GlobalDocumentDialogSettings } from '../../shared/global-document-dialog';

@Component({
  selector: 'intelligence-form-button',
  styleUrls: ['./intelligence-form-button.component.scss'],
  templateUrl: './intelligence-form-button.component.html',
})
export class IntelligenceFormButtonComponent {

  document: DocumentModel;

  dialogSettings: GlobalDocumentDialogSettings;

  addChildrenPermission$: Observable<boolean> = observableOf(false);

  @Input() title: string;

  @Input()
  set type(type: 'brands folder') {
    this.dialogSettings = this.getDialogFormSettings(type);
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

  private getDialogFormSettings(type: string): GlobalDocumentDialogSettings {
    const components: Type<DocumentModelForm>[] = [];
    switch (type) {
      case 'brands folder':
        components.push(GLOBAL_DOCUMENT_FORM.INTELLIGENCE_BRANDS_FORM);
        break;
      case 'asset':
        components.push(GLOBAL_DOCUMENT_FORM.INTELLIGENCE_ASSET_FORM);
        break;
      default:
        throw new Error(`unknown document form component for '${type}'`);
    }
    return new GlobalDocumentDialogSettings({ components });
  }

}
