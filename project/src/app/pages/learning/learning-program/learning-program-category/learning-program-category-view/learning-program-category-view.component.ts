import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'learning-program-category-view',
  styleUrls: ['./learning-program-category-view.component.scss'],
  templateUrl: './learning-program-category-view.component.html',
})
export class LearningProgramCategoryViewComponent {

  constructor(
    private viewportScroller: ViewportScroller,
  ) {
  }
  loading: boolean = true;

  docs: DocumentModel[] = [];

  @Input()
  set documents(docs: DocumentModel[]) {
    if (docs) {
      this.docs = docs;
      this.loading = false;
    }
  }

  scrollToDocument(doc: any): void {
    this.viewportScroller.scrollToAnchor(doc.title);
    window.scrollTo(window.scrollX, window.scrollY - 131);
  }
}
