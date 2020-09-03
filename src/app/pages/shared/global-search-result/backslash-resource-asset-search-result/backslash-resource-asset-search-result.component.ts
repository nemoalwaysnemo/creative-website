import { Component, Input } from '@angular/core';
import { BaseSearchResultComponent } from '../base-search-result.component';
import { DocumentPageService } from '../../services/document-page.service';

@Component({
  selector: 'backslash-resource-asset-search-result',
  templateUrl: './backslash-resource-asset-search-result.component.html',
  styleUrls: ['../thumbnail-view.scss'],
})
export class BackslashResourceAssetSearchResultComponent extends BaseSearchResultComponent  {

  @Input() folderId: string;

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  protected onInit(): void {
    this.onQueryParamsChanged();
  }
}
