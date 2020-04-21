import { Component, Input } from '@angular/core';

@Component({
  selector: 'biz-dev-thought-leadership-folder-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './biz-dev-thought-leadership-folder-asset-search-result.component.html',
})
export class BizDevThoughtLeadershipFolderAssetSearchResultComponent {

  @Input() folderId: string;

}
