import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';

@Component({
  selector: 'learning-program-category-view',
  styleUrls: ['./learning-program-category-view.component.scss'],
  templateUrl: './learning-program-category-view.component.html',
})
export class LearningProgramCategoryViewComponent {

  loading: boolean = true;

  docs: DocumentModel[] = [];

  @Input()
  set documents(docs: DocumentModel[]) {
    if (docs) {
      this.docs = docs;
      this.loading = false;
    }
  }

  scrollToDocument(doc: any): string {
    return '#/p/learning/program#' + doc.title;
  }
}
