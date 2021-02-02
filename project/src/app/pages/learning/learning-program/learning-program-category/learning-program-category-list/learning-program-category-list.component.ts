import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';

@Component({
  selector: 'learning-program-category-list',
  styleUrls: ['./learning-program-category-list.component.scss'],
  templateUrl: './learning-program-category-list.component.html',
})
export class LearningProgramCategoryListComponent {

  docs: DocumentModel[] = [];

  @Input()
  set documents(docs: DocumentModel[]) {
    if (docs) {
      this.docs = docs;
    }
  }
}
