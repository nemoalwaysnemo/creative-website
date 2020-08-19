import { Component, Input } from '@angular/core';

@Component({
  selector: 'backslash-resource-folder-asset-search-result',
  templateUrl: './backslash-resource-folder-asset-search-result.component.html',
  styleUrls: ['../thumbnail-view.scss'],
})
export class BackslashResourceFolderAssetSearchResultComponent {

  @Input() folderId: string;

}
