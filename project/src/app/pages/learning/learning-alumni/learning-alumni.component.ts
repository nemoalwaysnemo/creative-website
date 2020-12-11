import { Component } from '@angular/core';
import { DocumentPageService } from '@pages/shared';
import { BaseDocumentViewComponent } from '../../shared/abstract-classes/base-document-view.component';

@Component({
  selector: 'learning-alumni',
  styleUrls: ['./learning-alumni.component.scss'],
  templateUrl: './learning-alumni.component.html',
})
export class LearningAlumniComponent extends BaseDocumentViewComponent {

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  onInit(): void {
    this.setCurrentDocument();
  }

}
