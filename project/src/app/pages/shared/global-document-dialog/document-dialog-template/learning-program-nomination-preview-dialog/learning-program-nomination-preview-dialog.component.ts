import { Component } from '@angular/core';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { DocumentPageService } from '../../../services/document-page.service';
import { DocumentDialogPreviewTemplateComponent } from '../../document-dialog-preview-template.component';
import { DatePipe } from '@angular/common';
import { DocumentModel } from '@core/api';

@Component({
  selector: 'learning-program-nomination-preview-dialog',
  styleUrls: ['../global-document-dialog-template.scss', './learning-program-nomination-preview-dialog.component.scss'],
  templateUrl: './learning-program-nomination-preview-dialog.component.html',
})
export class LearningProgramNominationPreviewDialogComponent extends DocumentDialogPreviewTemplateComponent {

  static readonly NAME: string = 'learning-program-nomination-preview';

  startUrl: string;

  programPhoto: { url: string, type: string, name: string };

  dateList: string[] = [];

  criteriaList: string[] = [];

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected documentPageService: DocumentPageService,
  ) {
    super(globalDocumentDialogService, documentPageService);
  }

  protected setDocument(doc: DocumentModel): void {
    if (doc) {
      this.document = doc;
      this.programPhoto = this.getProgramFiles('app_Learning:program_photo').shift();
      this.criteriaList = this.document.get('app_Learning:program_nomination_criteria');
      this.dateList = this.parseDate();
    }
  }

  parseDate(): string[] {
    return this.document.get('app_Learning:program_dates').map((item: string) => {
      return new DatePipe('en-US').transform(item, 'yyyy-MM-dd');
    });
  }

  getProgramFiles(type: string): { url: string, type: string, name: string }[] {
    return this.document.getCustomFiles(type);
  }

}
