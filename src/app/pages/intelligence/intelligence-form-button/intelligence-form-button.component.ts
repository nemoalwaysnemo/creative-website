import { Component, Input, OnInit, OnDestroy, Type, ViewContainerRef } from '@angular/core';
import { DocumentModel, NuxeoPermission } from '@core/api';
import { Observable, of as observableOf } from 'rxjs';
import { GlobalDocumentDialogService, DocumentModelForm } from '@pages/shared';
import { GLOBAL_DOCUMENT_FORM } from '@pages/shared/global-document-form';

@Component({
  selector: 'intelligence-form-button',
  styleUrls: ['./intelligence-form-button.component.scss'],
  templateUrl: './intelligence-form-button.component.html',
})
export class IntelligenceFormButtonComponent {

  document: DocumentModel;

  component: Type<DocumentModelForm>;

  addChildrenPermission$: Observable<boolean> = observableOf(false);

  @Input() title: string;

  @Input()
  set type(type: 'brands folder') {
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
      case 'brands folder':
        formComponent = GLOBAL_DOCUMENT_FORM.INTELLIGENCE_BRANDS_FORM;
        break;
      default:
        throw new Error(`unknown document form component for '${type}'`);
    }
    return formComponent;
  }

}
