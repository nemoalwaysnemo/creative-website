import { Component, Input } from '@angular/core';
import { BaseSearchResultComponent } from '../base-search-result.component';
import { DocumentPageService } from '../../services/document-page.service';

@Component({
  selector: 'backslash-trigger-pool-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './backslash-trigger-pool-asset-search-result.component.html',
})
export class BackslashTriggerPoolAssetSearchResultComponent extends BaseSearchResultComponent {

  @Input() folderId: string;
  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  protected onInit(): void {
    this.onQueryParamsChanged();
  }
}
