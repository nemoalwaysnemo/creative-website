import { Component, Input, Type, TemplateRef } from '@angular/core';
import { DocumentModel, NuxeoPermission } from '@core/api';
import { Observable, of as observableOf } from 'rxjs';
import { GlobalDocumentDialogService, DocumentModelForm } from '@pages/shared';
import { GLOBAL_DOCUMENT_FORM } from '@pages/shared/global-document-form';
import { Router } from '@angular/router';

@Component({
  selector: 'creative-agency-form-button',
  styleUrls: ['./creative-agency-form-button.component.scss'],
  templateUrl: './creative-agency-form-button.component.html',
})
export class CreativeAgencyFormButtonComponent {

  document: DocumentModel;

  component: Type<DocumentModelForm>;

  addChildrenPermission$: Observable<boolean> = observableOf(false);

  redirectUrl: string = this.router.url;

  @Input() title: string;

  @Input()
  set type(type: 'brand') {
    this.component = this.getFormComponent(type);
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
    this.globalDocumentDialogService.open(dialog);
  }

  private getFormComponent(type: string): Type<DocumentModelForm> {
    let formComponent;
    switch (type) {
      case 'brand':
        formComponent = GLOBAL_DOCUMENT_FORM.CREATIVE_ASSET_BRAND_FORM;
        break;
      default:
        throw new Error(`unknown document form component for '${type}'`);
    }
    return formComponent;
  }

}
