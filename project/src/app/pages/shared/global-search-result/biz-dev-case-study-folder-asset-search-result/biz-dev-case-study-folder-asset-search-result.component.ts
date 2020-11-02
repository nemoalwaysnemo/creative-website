import { Component, Input } from '@angular/core';

@Component({
  selector: 'biz-dev-case-study-folder-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './biz-dev-case-study-folder-asset-search-result.component.html',
})
export class BizDevCaseStudyFolderAssetSearchResultComponent {

  @Input() folderId: string;

}
