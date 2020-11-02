import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';
import { DocumentPageService } from '../../services/document-page.service';
import { BaseSearchResultComponent } from '../base-search-result.component';

@Component({
  selector: 'backslash-resource-folder-asset-search-result',
  templateUrl: './backslash-resource-folder-asset-search-result.component.html',
  styleUrls: ['../thumbnail-view.scss'],
})
export class BackslashResourceFolderAssetSearchResultComponent extends BaseSearchResultComponent {

  @Input() folderId: string;

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  protected onInit(): void {
    this.onQueryParamsChanged();
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
