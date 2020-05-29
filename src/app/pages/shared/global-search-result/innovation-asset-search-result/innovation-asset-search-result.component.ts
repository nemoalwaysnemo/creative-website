import { Component, Input } from '@angular/core';
import { BaseSearchResultComponent } from '../base-search-result.component';
import { SearchQueryParamsService } from '../../services/search-query-params.service';
import { NUXEO_PATH_INFO } from '@environment/environment';

@Component({
  selector: 'innovation-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './innovation-asset-search-result.component.html',
})
export class InnovationAssetSearchResultComponent extends BaseSearchResultComponent {

  folderUrl: string;

  @Input() folderId: string;

  @Input()
  set assetUrl(url: string) {
    if (url) {
      this.folderUrl = this.getUrl(url);
    }
  }

  constructor(protected queryParamsService: SearchQueryParamsService) {
    super(queryParamsService);
  }

  protected onInit(): void {
    this.onQueryParamsChanged();
  }

  protected getUrl(url: string): string {
    let path;
    url = decodeURI(url);
    if (url.includes('/NEXT')) {
      path = '/p/innovation/NEXT/folder/';
    } else if (url.includes('/Things to Steal')) {
      path = '/p/innovation/Things to Steal/folder/';
    }

    return path;
  }

  isParentFolder(doc): boolean {
    const path =  doc.path + '/';
    return (doc && ((path === NUXEO_PATH_INFO.INNOVATION_NEXT_FOLDER_PATH) || (path === NUXEO_PATH_INFO.INNOVATION_THINGS_TO_STEAL_FOLDER_PATH))) ? true : false;
  }
}
