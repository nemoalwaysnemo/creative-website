import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';
@Component({
  selector: 'creative-brand-project-list-preview',
  styleUrls: ['./creative-brand-project-list-preview.component.scss'],
  templateUrl: './creative-brand-project-list-preview.component.html',
})
export class CreativeBrandProjectListPreviewComponent {
  doc: DocumentModel;

  @Input()
  set document(doc: DocumentModel) {
    this.doc = doc;
  }

}
