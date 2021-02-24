import { Component, Input } from '@angular/core';
import { BaseSearchResultComponent } from '../base-search-result.component';
import { DocumentPageService } from '../../services/document-page.service';
import { DocumentModel } from '@core/api';

@Component({
  selector: 'backslash-region-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './backslash-region-search-result.component.html',
})
export class BackslashRegionSearchResultComponent extends BaseSearchResultComponent {

  @Input() folderId: string;

  @Input() enableScrolling: boolean = true;

  @Input() regions: [];

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  protected onInit(): void {
    this.onQueryParamsChanged();
  }

  getAssetPath(doc: DocumentModel): string {
    return doc.facets.includes('Thumbnail') && doc.contextParameters && doc.contextParameters.thumbnail ? doc.contextParameters.thumbnail.url : '/assets/images/App-Intelligence-Brands-Icon.jpg';
  }
}
