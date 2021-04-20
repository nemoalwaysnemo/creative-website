import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';
import { DocumentPageService } from '../../../shared/services/document-page.service';
import { BaseSearchResultComponent } from '../base-search-result.component';

@Component({
  selector: 'backslash-case-study-folder-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './backslash-case-study-folder-asset-search-result.component.html',
})
export class BackslashCaseStudyFolderAssetSearchResultComponent extends BaseSearchResultComponent {

  @Input() folderId: string;

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  goToLink(doc: DocumentModel): void {
    this.documentPageService.goToExternalLink(doc);
  }

}
