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
        ecm_primaryType: NUXEO_META_INFO.BACKSLASH_ARTICLE_TYPES,
      },
    },
    {
      name: 'Distruption',
      layout: 'distruption',
      itemLayout: 'default',
      icon: 'nb-person',
      params: {
        pageSize: 8,
        ecm_path: NUXEO_META_INFO.DISRUPTION_BASE_FOLDER_PATH,
        ecm_primaryType: NUXEO_META_INFO.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
      },
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
