import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';

@Component({
  selector: 'document-creative-project-info',
  styleUrls: ['./document-creative-project-info.component.scss'],
  templateUrl: './document-creative-project-info.component.html',
})
export class DocumentCreativeProjectInfoComponent {

  loading: boolean = true;

  doc: DocumentModel;

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.doc = doc;
      this.loading = false;
    }
  }

}
