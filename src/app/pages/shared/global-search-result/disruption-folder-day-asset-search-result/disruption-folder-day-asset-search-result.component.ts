import { Component, Input } from '@angular/core';

@Component({
  selector: 'tbwa-disruption-folder-day-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './disruption-folder-day-asset-search-result.component.html',
})
export class DisruptionFolderDayAssetSearchResultComponent {

  @Input() folderId: string;

}
