import { Component, Input } from '@angular/core';
import { DocumentRelatedInfoService } from './document-related-info.service';
import { DocumentModel } from '@core/api';
import { NUXEO_META_INFO } from '@environment/environment';
import { NbTabComponent } from '@core/nebular/theme/components/tabset/tabset.component';

@Component({
  selector: 'tbwa-document-related-info',
  styleUrls: ['./document-related-info.component.scss'],
  templateUrl: './document-related-info.component.html',
})
export class DocumentRelatedInfoComponent {

  tabItems = [
    {
      name: 'Backslash',
      layout: 'backslash',
      itemLayout: 'backslash',
      icon: 'nb-person',
      params: {
        pageSize: 8,
        app_edges_active_article: true,
        ecm_path: NUXEO_META_INFO.BACKSLASH_BASE_FOLDER_PATH,
      },
      paramsMapping: {
        'tagsEdgesAny': 'app_Edges:Tags_edges',
      },
      provider: NUXEO_META_INFO.BACKSLASH_ASSET_PAGE_PROVIDER,
    },
    {
      name: 'Disruption',
      layout: 'disruption',
      itemLayout: 'disruption',
      icon: 'nb-person',
      params: {
        pageSize: 8,
        ecm_path: NUXEO_META_INFO.DISRUPTION_BASE_FOLDER_PATH,
      },
      paramsMapping: {
        'tagsEdgesAny': 'app_Edges:Tags_edges',
        'industryAny': 'app_Edges:industry',
        'campaign': 'The_Loupe_Main:campaign',
      },
      provider: NUXEO_META_INFO.DISRUPTION_ASSET_PAGE_PROVIDER,
    },
    {
      name: 'Intelligence',
      layout: 'intelligence',
      itemLayout: 'intelligence',
      icon: 'nb-person',
      params: {
        pageSize: 8,
        ecm_path: NUXEO_META_INFO.INTELLIGENCE_BASE_FOLDER_PATH,
      },
      paramsMapping: {
        'tagsEdgesAny': 'app_Edges:Tags_edges',
        'industryAny': 'app_Edges:industry',
        'projectName': 'app_Edges:project_name',
      },
      provider: NUXEO_META_INFO.INTELLIGENCE_ASSET_PAGE_PROVIDER,
    },
  ];

  @Input() document: DocumentModel;

  constructor(private documentRelatedInfoService: DocumentRelatedInfoService) { }

  onChangTab(tab: NbTabComponent): void {
    this.documentRelatedInfoService.changeTab(this.getTabItem(tab));
  }

  private getTabItem(tab: NbTabComponent): any {
    return this.tabItems.filter((x) => tab.tabTitle === x.name).shift();
  }

}
