import { Component } from '@angular/core';
import { DocumentPageService } from '@pages/shared';
import { BaseDocumentViewComponent } from '../../shared/abstract-classes/base-document-view.component';

@Component({
  selector: 'learning-program',
  styleUrls: ['./learning-program.component.scss'],
  templateUrl: './learning-program.component.html',
})
export class LearningProgramComponent extends BaseDocumentViewComponent {

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  onInit(): void {
    this.setCurrentDocument();
  }

}
