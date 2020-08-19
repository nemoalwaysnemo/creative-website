import { Component, Input } from '@angular/core';
import { BaseSearchResultComponent } from '../base-search-result.component';
import { DocumentPageService } from '../../services/document-page.service';

@Component({
  selector: 'backslash-case-study-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './backslash-case-study-asset-search-result.component.html',
})
export class BackslashCaseStudyAssetSearchResultComponent extends BaseSearchResultComponent {

  @Input() folderId: string;
  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  protected onInit(): void {
    this.onQueryParamsChanged();
  }
}
