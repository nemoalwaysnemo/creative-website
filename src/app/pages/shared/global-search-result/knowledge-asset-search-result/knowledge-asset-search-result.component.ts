import { Component } from '@angular/core';
import { DocumentModel } from '@core/api';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';
import { getAssetModuleType } from '@core/services/helpers';

@Component({
  selector: 'knowledge-asset-search-result',
  styleUrls: ['./knowledge-asset-search-result.component.scss'],
  templateUrl: './knowledge-asset-search-result.component.html',
})

export class KnowledgeAssetSearchResultComponent {

  constructor() { }

  getAssetUrl(doc: DocumentModel): string {
    let url = '';
    if (NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES.includes(doc.type)) {
      url = '/p/creative/asset';
    } else if (NUXEO_DOC_TYPE.BACKSLASH_ARTICLE_VIDEO_TYPES.includes(doc.type)) {
      url = '/p/backslash/asset';
    } else if (NUXEO_DOC_TYPE.INTELLIGENCE_ASSET_TYPE.includes(doc.type)) {
      url = '/p/intelligence/asset';
    } else if (NUXEO_DOC_TYPE.DISRUPTION_ASSET_TYPE.includes(doc.type)) {
      url = '/p/disruption/asset';
    } else if (NUXEO_DOC_TYPE.INNOVATION_ASSET_TYPE.includes(doc.type)) {
      if (doc.path.includes('/NEXT/')) {
        url = '/p/innovation/NEXT/folder/:parentRef/asset';
      } else if (doc.path.includes('/Things to Steal/')) {
        url = '/p/innovation/Things to Steal/folder/:parentRef/asset';
      }
    } else if (NUXEO_DOC_TYPE.BIZ_DEV_ASSET_TYPE.includes(doc.type)) {
      if (doc.type === 'App-BizDev-CaseStudy-Asset') {
        url = '/p/business-development/Case Studies/folder/:parentRef/asset';
      } else if (doc.type === 'App-BizDev-Thought-Asset') {
        url = '/p/business-development/Thought Leadership/folder/:parentRef/asset';
      }
    }
    return url.replace(':parentRef', doc.parentRef);
  }

  getAssetType(doc: DocumentModel): string {
    return getAssetModuleType(doc);
  }
}
