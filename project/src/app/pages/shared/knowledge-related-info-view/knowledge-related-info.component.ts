import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';
import { Subject, timer } from 'rxjs';
import { NbTabComponent } from '@core/nebular/theme/components/tabset/tabset.component';
import { NUXEO_DOC_TYPE } from '@environment/environment';
import { DocumentPageService, GlobalEvent } from '../services/document-page.service';

export class TabInfo {
  readonly type: string;
  readonly tabItem: any;
  readonly document: DocumentModel;
  constructor(type: string, item: any, doc: DocumentModel) {
    this.type = type;
    this.tabItem = item;
    this.document = doc;
  }
}

@Component({
  selector: 'knowledge-related-info',
  styleUrls: ['./knowledge-related-info.component.scss'],
  templateUrl: './knowledge-related-info.component.html',
})
export class KnowledgeRelatedInfoComponent {

  @Input() tabItems = [
    {
      name: 'Backslash',
      layout: 'backslash',
      params: {
        pageSize: 8,
        app_edges_active_article: true,
        ecm_path: this.documentPageService.getConfig('path:BACKSLASH_BASE_FOLDER_PATH'),
      },
      paramsMapping: {
        tagsEdgesAny: 'app_Edges:Tags_edges',
      },
      provider: NUXEO_DOC_TYPE.BACKSLASH_ASSET_PAGE_PROVIDER,
    },
    {
      name: 'Disruption',
      layout: 'disruption',
      params: {
        pageSize: 8,
        ecm_path: this.documentPageService.getConfig('path:DISRUPTION_BASE_FOLDER_PATH'),
      },
      paramsMapping: {
        brandAny: 'The_Loupe_Main:brand',
        industryAny: 'app_Edges:industry',
        tagsEdgesAny: 'app_Edges:Tags_edges',
      },
      provider: NUXEO_DOC_TYPE.DISRUPTION_ASSET_PAGE_PROVIDER,
    },
    {
      name: 'Intelligence',
      layout: 'intelligence',
      params: {
        pageSize: 8,
        ecm_path: this.documentPageService.getConfig('path:INTELLIGENCE_BASE_FOLDER_PATH'),
      },
      paramsMapping: {
        brandAny: 'The_Loupe_Main:brand',
        industryAny: 'app_Edges:industry',
        tagsEdgesAny: 'app_Edges:Tags_edges',
      },
      provider: NUXEO_DOC_TYPE.INTELLIGENCE_ASSET_PAGE_PROVIDER,
    },
    {
      name: 'Creative',
      layout: 'creative',
      children: [
        {
          name: 'Brand',
          layout: 'brand',
          enableSearchInput: false,
          params: {
            pageSize: 4,
            ecm_path: this.documentPageService.getConfig('path:CREATIVE_TBWA_FOLDER_PATH'),
            ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_TYPES,
          },
          provider: NUXEO_DOC_TYPE.BASE_SEARCH_PROVIDER,

        },
        {
          name: 'Agency',
          layout: 'agency',
          enableSearchInput: false,
          params: {
            pageSize: 4,
            app_global_networkshare: true,
            ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
            ecm_path: this.documentPageService.getConfig('path:CREATIVE_TBWA_FOLDER_PATH'),
          },
          provider: NUXEO_DOC_TYPE.BASE_SEARCH_PROVIDER,
        },
      ],
    },
  ];

  tabInfo$ = new Subject<TabInfo>();

  doc: DocumentModel;

  currentTab: any;

  hideRelatedTitle: boolean = false;

  constructor(private documentPageService: DocumentPageService) {
    this.currentTab = this.tabItems[0];
    this.documentPageService.onEventType('knowledge-inner-dialog').subscribe((e: GlobalEvent) => {
      if (e.name === 'Opened') {
        this.hideRelatedTitle = true;
      } else {
        this.hideRelatedTitle = false;
      }
    });
  }

  @Input()
  set hideTab(tab: string) {
    if (tab) {
      this.tabItems = this.tabItems.filter((item) => item.name !== tab);
    }
  }

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.doc = doc;
      timer(0).subscribe(() => { this.tabInfo$.next(new TabInfo('docChanged', this.currentTab, doc)); });
    }
  }

  onChangTab(tab: NbTabComponent): void {
    const info = this.getTabItem(tab);
    if (tab.tabTitle !== this.currentTab.name) {
      this.tabInfo$.next(new TabInfo('tabChanged', info, this.doc));
    }
    this.currentTab = info;
  }

  private getTabItem(tab: NbTabComponent): any {
    return this.tabItems.filter((x) => tab.tabTitle === x.name).shift();
  }
}
