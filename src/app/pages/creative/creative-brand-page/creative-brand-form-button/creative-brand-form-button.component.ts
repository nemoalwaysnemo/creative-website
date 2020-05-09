import { Component, Input, Type, TemplateRef } from '@angular/core';
import { DocumentModel, NuxeoPermission } from '@core/api';
import { Observable, of as observableOf } from 'rxjs';
import { GlobalDocumentDialogService, DocumentModelForm } from '@pages/shared';
import { GLOBAL_DOCUMENT_FORM } from '@pages/shared/global-document-form';
import { Router } from '@angular/router';

@Component({
  selector: 'creative-brand-form-button',
  styleUrls: ['./creative-brand-form-button.component.scss'],
  templateUrl: './creative-brand-form-button.component.html',
})
export class CreativeBrandFormButtonComponent {

  document: DocumentModel;

  component: Type<DocumentModelForm>;

  addChildrenPermission$: Observable<boolean> = observableOf(false);

  redirectUrl: string = this.router.url;

  @Input() title: string;

  @Input()
  set type(type: 'image' | 'video' | 'audio' | 'model' | 'music' | 'photo' | 'stock' | 'campaign' | 'project') {
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
      case 'image':
        formComponent = GLOBAL_DOCUMENT_FORM.CREATIVE_ASSET_IMAGE_FORM;
        break;
      case 'video':
        formComponent = GLOBAL_DOCUMENT_FORM.CREATIVE_ASSET_VIDEO_FORM;
        break;
      case 'audio':
        formComponent = GLOBAL_DOCUMENT_FORM.CREATIVE_ASSET_AUDIO_FORM;
        break;
      case 'model':
        formComponent = GLOBAL_DOCUMENT_FORM.CREATIVE_USAGE_RIGHTS_MODEL_FORM;
        break;
      case 'music':
        formComponent = GLOBAL_DOCUMENT_FORM.CREATIVE_USAGE_RIGHTS_MUSIC_FORM;
        break;
      case 'photo':
        formComponent = GLOBAL_DOCUMENT_FORM.CREATIVE_USAGE_RIGHTS_PHOTO_FORM;
        break;
      case 'stock':
        formComponent = GLOBAL_DOCUMENT_FORM.CREATIVE_USAGE_RIGHTS_STOCK_FORM;
        break;
      case 'campaign':
        formComponent = GLOBAL_DOCUMENT_FORM.CREATIVE_CAMPAIGN_FORM;
        break;
      case 'project':
        formComponent = GLOBAL_DOCUMENT_FORM.CREATIVE_PROJECT_FORM;
        break;
      default:
        throw new Error(`unknown document form component for '${type}'`);
    }
    return formComponent;
  }

}
