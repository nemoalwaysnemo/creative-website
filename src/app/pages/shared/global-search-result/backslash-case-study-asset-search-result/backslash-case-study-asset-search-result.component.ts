import { Component, Input } from '@angular/core';
import { BaseSearchResultComponent } from '../base-search-result.component';
import { DocumentPageService } from '../../services/document-page.service';
import { assetPath } from '@core/services/helpers';
import { SearchResponse } from '@core/api';

@Component({
  selector: 'backslash-case-study-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './backslash-case-study-asset-search-result.component.html',
})
export class BackslashCaseStudyAssetSearchResultComponent extends BaseSearchResultComponent {

  @Input() folderId: string;

  @Input() enableScrolling: boolean = true;

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  protected onInit(): void {
    this.onQueryParamsChanged();
  }

  assetPath(path: string) {
    return assetPath(path);
  }
}
