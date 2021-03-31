import { Component } from '@angular/core';
import { DocumentModel } from '@core/api';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { DocumentPageService } from '../../../services/document-page.service';
import { DocumentDialogPreviewTemplateComponent } from '../../document-dialog-preview-template.component';

@Component({
  selector: 'learning-program-alumni-preview-dialog',
  styleUrls: ['../global-document-dialog-template.scss', './learning-program-alumni-preview-dialog.component.scss'],
  templateUrl: './learning-program-alumni-preview-dialog.component.html',
})
export class LearningProgramAlumniPreviewDialogComponent extends DocumentDialogPreviewTemplateComponent {

  static readonly NAME: string = 'learning-program-alumni-preview';

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected documentPageService: DocumentPageService,
  ) {
    super(globalDocumentDialogService, documentPageService);
  }

  protected setDocument(doc: DocumentModel): void {
    if (doc) {
      this.document = doc;
    }
  }

  getFacebookUrl(doc: DocumentModel, width: number): string {
    const url = doc.get('remote-search-collective-user:facebook_photo_url');
    if (url) {
      return url + '&width=' + width;
    } else {
      return '/assets/images/no-thumbnail.png';
    }
  }

}
