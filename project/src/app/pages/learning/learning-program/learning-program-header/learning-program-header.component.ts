import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';
import { BaseDocumentViewComponent, DocumentPageService } from '@pages/shared';

@Component({
  selector: 'learning-program-header',
  styleUrls: ['./learning-program-header.component.scss'],
  templateUrl: './learning-program-header.component.html',
})
export class LearningProgramHeaderComponent extends BaseDocumentViewComponent {

  src: string;

  document: DocumentModel;

  @Input()
  set programs(doc: DocumentModel) {
    if (doc) {
      this.document = doc;
      this.src = doc.getCustomFile('app_Learning:program_banner', false);
    }
  }

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

}
