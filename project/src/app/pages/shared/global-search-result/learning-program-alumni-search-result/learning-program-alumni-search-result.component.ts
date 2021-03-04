import { Component, TemplateRef, Type } from '@angular/core';
import { DocumentModel } from '@core/api';
import { GLOBAL_DOCUMENT_DIALOG, GlobalDocumentDialogService, GlobalDocumentDialogSettings } from '../../global-document-dialog';

@Component({
  selector: 'learning-program-alumni-search-result',
  styleUrls: ['./learning-program-alumni-search-result.component.scss'],
  templateUrl: './learning-program-alumni-search-result.component.html',
})
export class LearningProgramAlumniSearchResultComponent {

  constructor(private globalDocumentDialogService: GlobalDocumentDialogService) { }

  dialogMetadata: any = {
  };

  getDialogSettings(doc: DocumentModel): GlobalDocumentDialogSettings {
    const components: Type<any>[] = [GLOBAL_DOCUMENT_DIALOG.PREVIEW_LEARNING_ALUMNI];
    return new GlobalDocumentDialogSettings({ components });
  }

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog);
  }

  getTitle(doc: DocumentModel): string {
    return '';
  }

  getFacebookUrl(doc: DocumentModel): string {
    if (!doc.get('remote-search-collective-user:facebook_photo_url')) {
      return '/assets/images/no-thumbnail.png';
    } else {
      return doc.get('remote-search-collective-user:facebook_photo_url');
    }
  }
}
