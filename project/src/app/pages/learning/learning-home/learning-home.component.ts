import { Component } from '@angular/core';
import { DocumentPageService } from '@pages/shared';
import { BaseDocumentViewComponent } from '../../shared/abstract-classes/base-document-view.component';

@Component({
  selector: 'learning-home',
  styleUrls: ['./learning-home.component.scss'],
  templateUrl: './learning-home.component.html',
})
export class LearningHomeComponent extends BaseDocumentViewComponent {

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  onInit(): void {
    this.setCurrentDocument();
  }

}
