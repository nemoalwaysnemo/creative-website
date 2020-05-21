import { Component, Input, Type, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentModel, NuxeoPermission } from '@core/api';
import { Observable, of as observableOf } from 'rxjs';
import { GlobalDocumentDialogService, DocumentModelForm } from '../../../shared';
import { GLOBAL_DOCUMENT_FORM } from '../../../shared/global-document-form';
import { GlobalDocumentDialogSettings } from '../../../shared/global-document-dialog/global-document-dialog.interface';

@Component({
  selector: 'creative-brand-form-button',
  styleUrls: ['./creative-brand-form-button.component.scss'],
  templateUrl: './creative-brand-form-button.component.html',
})
export class CreativeBrandFormButtonComponent {

  document: DocumentModel;

  dialogSettings: GlobalDocumentDialogSettings;

  addChildrenPermission$: Observable<boolean> = observableOf(false);

  redirectUrl: string = this.router.url;

  @Input() title: string;

  @Input()
  set type(type: 'image' | 'video' | 'audio' | 'model' | 'music' | 'photo' | 'stock' | 'campaign' | 'project') {
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
    this.globalDocumentDialogService.open(dialog);
  }

  private getDialogFormSettings(type: string): GlobalDocumentDialogSettings {
    const components: Type<DocumentModelForm>[] = [];
    switch (type) {
      case 'image':
        components.push(GLOBAL_DOCUMENT_FORM.CREATIVE_ASSET_IMAGE_FORM);
        break;
      case 'video':
        components.push(GLOBAL_DOCUMENT_FORM.CREATIVE_ASSET_VIDEO_FORM);
        break;
      case 'audio':
        components.push(GLOBAL_DOCUMENT_FORM.CREATIVE_ASSET_AUDIO_FORM);
        break;
      case 'model':
        components.push(GLOBAL_DOCUMENT_FORM.CREATIVE_USAGE_RIGHTS_MODEL_FORM);
        break;
      case 'music':
        components.push(GLOBAL_DOCUMENT_FORM.CREATIVE_USAGE_RIGHTS_MUSIC_FORM);
        break;
      case 'photo':
        components.push(GLOBAL_DOCUMENT_FORM.CREATIVE_USAGE_RIGHTS_PHOTO_FORM);
        break;
      case 'stock':
        components.push(GLOBAL_DOCUMENT_FORM.CREATIVE_USAGE_RIGHTS_STOCK_FORM);
        break;
      case 'campaign':
        components.push(GLOBAL_DOCUMENT_FORM.CREATIVE_CAMPAIGN_FORM);
        break;
      case 'project':
        components.push(GLOBAL_DOCUMENT_FORM.CREATIVE_PROJECT_FORM);
        break;
      default:
        throw new Error(`unknown document form component for '${type}'`);
    }
    return new GlobalDocumentDialogSettings({ components });
  }

}
