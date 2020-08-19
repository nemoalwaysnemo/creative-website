import { Component, Input } from '@angular/core';

@Component({
  selector: 'backslash-case-study-folder-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './backslash-case-study-folder-asset-search-result.component.html',
})
export class BackslashCaseStudyFolderAssetSearchResultComponent {

  @Input() folderId: string;

}
