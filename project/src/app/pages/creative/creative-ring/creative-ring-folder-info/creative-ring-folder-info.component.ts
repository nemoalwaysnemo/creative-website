import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';
import { BaseDocumentViewComponent } from '@pages/shared';

@Component({
  selector: 'creative-ring-folder-info',
  styleUrls: ['../../../../theme/styles/document-metadata-view.scss', './creative-ring-folder-info.component.scss'],
  templateUrl: './creative-ring-folder-info.component.html',
})
export class CreativeRingFolderInfoComponent extends BaseDocumentViewComponent {

  @Input() loading: boolean;

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.doc = doc;
    }
  }

  doc: DocumentModel;
}
