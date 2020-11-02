import { Component, Input } from '@angular/core';

@Component({
  selector: 'backslash-edges-folder-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './backslash-edges-folder-asset-search-result.component.html',
})
export class BackslashEdgesFolderAssetSearchResultComponent {

  @Input() folderId: string;

}
