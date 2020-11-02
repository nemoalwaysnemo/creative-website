import { Component, Input } from '@angular/core';

@Component({
  selector: 'innovation-folder-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './innovation-folder-asset-search-result.component.html',
})
export class InnovationFolderAssetSearchResultComponent {

  @Input() folderId: string;

}
