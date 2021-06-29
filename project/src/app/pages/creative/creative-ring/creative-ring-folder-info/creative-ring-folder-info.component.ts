import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Observable, of as observableOf, timer } from 'rxjs';
import { DocumentModel, UserModel, NuxeoPermission, GlobalSearchParams } from '@core/api';
import { SelectableItemService } from '../../../shared/document-selectable';
import { GlobalDocumentViewComponent, DocumentPageService, GlobalSearchFormSettings, SearchFilterModel, BaseDocumentViewComponent } from '@pages/shared';
import { NUXEO_DOC_TYPE, NUXEO_PATH_INFO } from '@environment/environment';

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
