import { Component, Input } from '@angular/core';
import { BaseSearchResultComponent } from '../base-search-result.component';
import { DocumentPageService } from '../../services/document-page.service';
import { DocumentModel } from '@core/api';

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
      this.folderUrl = decodeURI(url);
    }
  }

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  protected onInit(): void {
    this.onQueryParamsChanged();
  }

  isParentFolder(doc: DocumentModel): boolean {
    const path = doc.path + '/';
    return doc && ((path === this.documentPageService.getConfig('path:INNOVATION_NEXT_FOLDER_PATH')) || (path === this.documentPageService.getConfig('path:INNOVATION_THINGS_TO_STEAL_FOLDER_PATH')));
  }

  goToLink(doc: DocumentModel): void {
    this.documentPageService.goToExternalLink(doc);
  }

}
