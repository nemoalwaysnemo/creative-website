import { Component, Input, Type } from '@angular/core';
import { DocumentModel, NuxeoPermission } from '@core/api';
import { Observable, of as observableOf } from 'rxjs';
import { GlobalDocumentDialogService, DocumentModelForm } from '@pages/shared';
import { GLOBAL_DOCUMENT_FORM } from '@pages/shared/global-document-form';

@Component({
  selector: 'biz-dev-form-button',
  styleUrls: ['./biz-dev-form-button.component.scss'],
  templateUrl: './biz-dev-form-button.component.html',
})
export class BizDevFormButtonComponent {

  document: DocumentModel;

  component: Type<DocumentModelForm>;

  addChildrenPermission$: Observable<boolean> = observableOf(false);

  @Input() title: string;

  @Input()
  set type(type: 'case' | 'case asset' | 'thought' | 'thought asset') {
    this.component = this.getFormComponent(type);
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

  openForm(dialog: any): void {
    this.globalDocumentDialogService.open(dialog, this.document);
  }

  private getFormComponent(type: string): Type<DocumentModelForm> {
    let formComponent;
    switch (type) {
      case 'case':
        formComponent = GLOBAL_DOCUMENT_FORM.BIZ_DEV_CASE_STUDIES_FOLDER_FORM;
        break;
      case 'case asset':
        formComponent = GLOBAL_DOCUMENT_FORM.BIZ_DEV_CASE_STUDIES_ASSET_FORM;
        break;
      case 'thought':
        formComponent = GLOBAL_DOCUMENT_FORM.BIZ_DEV_THOUGHT_LEADERSHIP_FOLDER_FORM;
        break;
      case 'thought asset':
        formComponent = GLOBAL_DOCUMENT_FORM.BIZ_DEV_THOUGHT_LEADERSHIP_ASSET_FORM;
        break;
      default:
        throw new Error(`unknown document form component for '${type}'`);
    }
    return formComponent;
  }

}
