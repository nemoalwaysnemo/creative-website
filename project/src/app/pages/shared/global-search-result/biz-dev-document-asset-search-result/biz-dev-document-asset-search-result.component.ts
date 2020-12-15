import { Component } from '@angular/core';
import { DocumentModel } from '@core/api';

@Component({
  selector: 'biz-dev-document-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './biz-dev-document-asset-search-result.component.html',
})
export class BizDevDocumentAssetSearchResultComponent {

  private assetUrlMapping: any = {
    'App-BizDev-CaseStudy-Folder': '/p/business-development/Case Studies/folder',
    'App-BizDev-Thought-Folder': '/p/business-development/Thought Leadership/folder',
    '*': '/p/business-development/asset',
  };

  getAssetUrl(doc: DocumentModel): string {
    if (doc.type === 'App-BizDev-CaseStudy-Asset') {
      return `/p/business-development/Case Studies/folder/${doc.parentRef}/asset/`;
    } else if (doc.type === 'App-BizDev-Thought-Asset') {
      return `/p/business-development/Thought Leadership/folder/${doc.parentRef}/asset/`;
    } else {
      return this.assetUrlMapping[doc.type] ? this.assetUrlMapping[doc.type] : this.assetUrlMapping['*'];
    }
  }
}
