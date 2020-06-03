import { Component } from '@angular/core';
import { DocumentModel } from '@core/api';
import { NUXEO_PATH_INFO } from '@environment/environment';

@Component({
  selector: 'innovation-document-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './innovation-document-asset-search-result.component.html',
})
export class InnovationDocumentAssetSearchResultComponent {

  getAssetUrl(doc: DocumentModel): string {
    if (doc.type !== 'App-Innovation-Folder' && doc.type !== 'App-Innovation-Asset') { return '/p/innovation/asset'; }
    let url: string;
    if (doc.path.includes(NUXEO_PATH_INFO.INNOVATION_BASE_FOLDER_PATH + '/NEXT')) {
      url = '/p/innovation/NEXT/folder';
    } else if (doc.path.includes(NUXEO_PATH_INFO.INNOVATION_BASE_FOLDER_PATH + '/Things to Steal')) {
      url = '/p/innovation/Things to Steal/folder';
    }
    if (doc.type === 'App-Innovation-Asset') {
      url = `${url}/${doc.parentRef}/asset`;
    }
    return url;
  }
}
