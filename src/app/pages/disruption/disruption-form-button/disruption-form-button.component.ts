import { Component, Input, Type, TemplateRef } from '@angular/core';
import { DocumentModel, NuxeoPermission } from '@core/api';
import { Observable, of as observableOf } from 'rxjs';
import { GlobalDocumentDialogService, DocumentModelForm } from '@pages/shared';
import { GLOBAL_DOCUMENT_FORM } from '@pages/shared/global-document-form';

@Component({
  selector: 'disruption-form-button',
  styleUrls: ['./disruption-form-button.component.scss'],
  templateUrl: './disruption-form-button.component.html',
})
export class DisruptionFormButtonComponent {

  document: DocumentModel;

  component: Type<DocumentModelForm>;

  addChildrenPermission$: Observable<boolean> = observableOf(false);

  @Input() title: string;

  @Input()
  set type(type: 'roadmap' | 'day' | 'day asset' | 'theory asset' | 'brilliant thinking') {
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

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog);
  }

  private getFormComponent(type: string): Type<DocumentModelForm> {
    let formComponent;
    switch (type) {
      case 'roadmap':
        formComponent = GLOBAL_DOCUMENT_FORM.DISRUPTION_ROADMAP_FORM;
        break;
      case 'day':
        formComponent = GLOBAL_DOCUMENT_FORM.DISRUPTION_DAY_FORM;
        break;
      case 'day asset':
        formComponent = GLOBAL_DOCUMENT_FORM.DISRUPTION_DAY_ASSET_FORM;
        break;
      case 'theory asset':
        formComponent = GLOBAL_DOCUMENT_FORM.DISRUPTION_HOW_TOS_ASSET_FORM;
        break;
      case 'brilliant thinking':
        formComponent = GLOBAL_DOCUMENT_FORM.DISRUPTION_BRILLIANT_THINKING_FORM;
        break;
      default:
        throw new Error(`unknown document form component for '${type}'`);
    }
    return formComponent;
  }

}
