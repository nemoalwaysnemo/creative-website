import { Component, Input } from '@angular/core';
import { BaseSearchResultComponent } from '../base-search-result.component';
import { DocumentPageService } from '../../services/document-page.service';
import { assetPath } from '@core/services/helpers';

@Component({
  selector: 'backslash-category-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './backslash-category-asset-search-result.component.html',
})
export class BackslashCategoryAssetSearchResultComponent extends BaseSearchResultComponent {

  @Input() folderId: string;

  @Input() enableScrolling: boolean = true;

  @Input() regions: [];

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
