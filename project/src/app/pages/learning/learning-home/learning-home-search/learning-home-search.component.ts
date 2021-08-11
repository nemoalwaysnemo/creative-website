import { Component } from '@angular/core';
import { DocumentModel } from '@core/api';
import { BaseDocumentViewComponent, GlobalSearchFormSettings, SearchFilterModel } from '@pages/shared';
import { NUXEO_DOC_TYPE } from '@environment/environment';
import { matchAssetUrl } from '@core/services/helpers';

@Component({
  selector: 'learning-home-search',
  styleUrls: ['./learning-home-search.component.scss'],
  templateUrl: './learning-home-search.component.html',
})
export class LearningHomeSearchComponent extends BaseDocumentViewComponent {

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    placeholder: 'Search...',
  });

  defaultParams: any = {
    pageSize: 10,
    currentPageIndex: 0,
    ecm_fulltext: '',
    ecm_path: this.documentPageService.getConfig('path:LEARNING_PROGRAM_FOLDER_PATH'),
    ecm_primaryType: NUXEO_DOC_TYPE.LEARNING_PROGRAM_ASSET_TYPE,
  };

  filters: SearchFilterModel[] = [
  ];

  assetUrlMapping: any = {
    'App-Learning-Program': '/p/learning/program',
    '*': '/p/learning/asset',
  };

  getAssetUrl(doc: DocumentModel): string {
    return matchAssetUrl(doc, this.assetUrlMapping);
  }

}
