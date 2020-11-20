import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';
import { DocumentPageService } from '../../services/document-page.service';
import { BaseSearchResultComponent } from '../base-search-result.component';

@Component({
  selector: 'disruption-folder-theory-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './disruption-folder-theory-asset-search-result.component.html',
})
export class DisruptionFolderTheoryAssetSearchResultComponent extends BaseSearchResultComponent {

  @Input() folderId: string;

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  goToLink(doc: DocumentModel): void {
    const url = doc.get('The_Loupe_Main:url');
    if (url) {
      this.documentPageService.openNewTab(url);
    } else {
      this.documentPageService.redirectTo404();
    }
  }
}
