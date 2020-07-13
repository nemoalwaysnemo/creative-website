import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DocumentModel } from '@core/api';
import { DocumentPageService } from '../services/document-page.service';
import { HomeSearchFormComponent } from '../home-search-form/home-search-form.component';
import { GlobalSearchFormSettings } from '../global-search-form/global-search-form.interface';
import { GlobalSearchFormService } from '../global-search-form/global-search-form.service';
import { getAssetModuleType } from '@core/services/helpers';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'knowledge-search-form',
  templateUrl: './knowledge-search-form.component.html',
  styleUrls: ['./knowledge-search-form.component.scss'],
})

export class KnowledgeSearchFormComponent extends HomeSearchFormComponent {

  formSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    source: 'knowledge-search-form',
  });

  constructor(
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected documentPageService: DocumentPageService,
    protected globalSearchFormService: GlobalSearchFormService,
  ) {
    super(
      router,
      formBuilder,
      documentPageService,
      globalSearchFormService,
    );
  }

  onKeyEnter(event: KeyboardEvent): void {
    this.redirectToListPage();
    event.preventDefault();
    event.stopImmediatePropagation();
  }

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
