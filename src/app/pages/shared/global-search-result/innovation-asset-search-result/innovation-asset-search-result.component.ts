import { Component, Input } from '@angular/core';
import { BaseSearchResultComponent } from '../base-search-result.component';
import { DocumentPageService } from '../../services/document-page.service';
import { NUXEO_PATH_INFO } from '@environment/environment';
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

  isExternalNewTab(doc: DocumentModel): boolean {
    return doc.get('app_global:ext_app_newtab');
  }

  isExternalIframe(doc: DocumentModel): boolean {
    return doc.get('app_global:ext_app_iframe');
  }

  isParentFolder(doc: DocumentModel): boolean {
    const path = doc.path + '/';
    return doc && ((path === NUXEO_PATH_INFO.INNOVATION_NEXT_FOLDER_PATH) || (path === NUXEO_PATH_INFO.INNOVATION_THINGS_TO_STEAL_FOLDER_PATH));
  }

  goToLink(doc: DocumentModel): void {
    const url = doc.get('The_Loupe_Main:url');
    if (url) {
      window.open(url, '_blank');
    } else {
      this.documentPageService.redirectTo404();
    }
  }

}
