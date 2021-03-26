import { Component } from '@angular/core';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { DocumentPageService } from '../../../services/document-page.service';
import { DocumentDialogPreviewTemplateComponent } from '../../document-dialog-preview-template.component';
import { DocumentModel } from '@core/api';
import { NUXEO_OUTER_LINK } from '@environment/environment';

@Component({
  selector: 'learning-program-nomination-preview-dialog',
  styleUrls: ['../global-document-dialog-template.scss', './learning-program-nomination-preview-dialog.component.scss'],
  templateUrl: './learning-program-nomination-preview-dialog.component.html',
})
export class LearningProgramNominationPreviewDialogComponent extends DocumentDialogPreviewTemplateComponent {

  static readonly NAME: string = 'learning-program-nomination-preview';

  startUrl: string = NUXEO_OUTER_LINK.nominationUrl;

  dateList: string[] = [];

  criteriaList: string[] = [];

  photoViewerSettings: any = {
    styleName: 'learning-program-nomination-preview',
    autoplay: false,
    srcFn: (doc: DocumentModel): string => {
      const files = doc.getCustomFiles('app_Learning:program_photo');
      if (files && files.length > 0) {
        return files[0].url;
      }
      return '/assets/images/no-thumbnail.png';
    },
    mimeTypeFn: (doc: DocumentModel): string => 'picture',
  };

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected documentPageService: DocumentPageService,
  ) {
    super(globalDocumentDialogService, documentPageService);
  }

  protected setDocument(doc: DocumentModel): void {
    if (doc) {
      this.document = doc;
      this.criteriaList = this.document.get('app_Learning:program_nomination_criteria');
      this.dateList = this.document.get('app_Learning:program_date');
    }
  }

  getProgramFiles(type: string): { url: string, type: string, name: string }[] {
    return this.document.getCustomFiles(type);
  }
}
