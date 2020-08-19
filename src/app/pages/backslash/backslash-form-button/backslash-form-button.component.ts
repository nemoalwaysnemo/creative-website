import { Component, Input, Type, TemplateRef } from '@angular/core';
import { DocumentModel, NuxeoPermission } from '@core/api';
import { Observable, of as observableOf } from 'rxjs';
import { Router } from '@angular/router';
import { GlobalDocumentDialogService, DocumentModelForm } from '../../shared';
import { GLOBAL_DOCUMENT_FORM } from '../../shared/global-document-form';
import { GlobalDocumentDialogSettings } from '../../shared/global-document-dialog';

@Component({
  selector: 'backslash-form-button',
  styleUrls: ['./backslash-form-button.component.scss'],
  templateUrl: './backslash-form-button.component.html',
})
export class BackslashFormButtonComponent {

  document: DocumentModel;

  dialogSettings: GlobalDocumentDialogSettings;

  addChildrenPermission$: Observable<boolean> = observableOf(false);

  redirectUrl: string = this.router.url;

  @Input() title: string;

  @Input()
  set type(type: 'video' | 'post' | 'edges' | 'edges asset' | 'resources' | 'resources asset' | 'case' | 'case asset' | 'category' | 'trigger') {
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

  buildRedirectUrl(): string {
    return window.location.href.split('#')[1].split('?')[0];
  }

  private getDialogFormSettings(type: string): GlobalDocumentDialogSettings {
    const components: Type<DocumentModelForm>[] = [];
    switch (type) {
      case 'video':
        components.push(GLOBAL_DOCUMENT_FORM.BACKSLASH_ASSET_VIDEO_FORM);
        break;
      case 'post':
        components.push(GLOBAL_DOCUMENT_FORM.BACKSLASH_ASSET_POST_FORM);
        break;
      case 'edges':
        components.push(GLOBAL_DOCUMENT_FORM.BACKSLASH_RESOURCES_FOLDER_FORM);
        break;
      case 'edges asset':
        components.push(GLOBAL_DOCUMENT_FORM.BACKSLASH_EDGES_ASSET_FORM);
        break;
      case 'resources':
        components.push(GLOBAL_DOCUMENT_FORM.BACKSLASH_RESOURCES_FOLDER_FORM);
        break;
      case 'resources asset':
        components.push(GLOBAL_DOCUMENT_FORM.BACKSLASH_RESOURCES_ASSET_FORM);
        break;
      case 'case':
        components.push(GLOBAL_DOCUMENT_FORM.BACKSLASH_CASE_STUDY_FOLDER_FORM);
        break;
      case 'case asset':
        components.push(GLOBAL_DOCUMENT_FORM.BACKSLASH_CASE_STUDY_ASSET_FORM);
        break;
      case 'category':
        components.push(GLOBAL_DOCUMENT_FORM.BACKSLASH_CASE_STUDY_CATEGORY_FORM);
        break;
      case 'trigger':
        components.push(GLOBAL_DOCUMENT_FORM.BACKSLASH_TRIGGER_FORM);
        break;
      default:
        throw new Error(`unknown document form component for '${type}'`);
    }
    return new GlobalDocumentDialogSettings({ components });
  }

}
