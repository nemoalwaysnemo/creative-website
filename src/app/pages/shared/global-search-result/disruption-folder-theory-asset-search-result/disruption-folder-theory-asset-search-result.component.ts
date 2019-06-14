import { Component, Input } from '@angular/core';

@Component({
  selector: 'disruption-folder-theory-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './disruption-folder-theory-asset-search-result.component.html',
})
export class DisruptionFolderTheoryAssetSearchResultComponent {

  @Input() folderId: string;

}
