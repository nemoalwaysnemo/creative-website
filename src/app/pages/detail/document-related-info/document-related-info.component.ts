import { Component, Input } from '@angular/core';
import { DocumentRelatedInfoService } from './document-related-info.service';
import { DocumentModel } from '@core/api';
import { NUXEO_META_INFO } from '@environment/environment';

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
      loading: false,
      params: {
        pageSize: 8,
        ecm_primaryType: NUXEO_META_INFO.LIBRARY_IMAGE_VIDEO_AUDIO_TYPES,
      },
    },
    {
      name: 'Distruption',
      layout: 'distruption',
      itemLayout: 'default',
      icon: 'nb-person',
      loading: false,
      params: {
        pageSize: 8,
        ecm_primaryType: NUXEO_META_INFO.LIBRARY_IMAGE_VIDEO_AUDIO_TYPES,
      },
    },

  ];

  @Input() document: DocumentModel;

  constructor(private documentRelatedInfoService: DocumentRelatedInfoService) { }

  onChangTab(tab: any): void {
    for (const tabItem of this.tabItems) {
      if (!tabItem.loading && tabItem.name === tab.tabTitle) {
        this.search('', tabItem.name);
      }
    }
  }

  private search(searchTerm: string, tabName: string): void {
    this.documentRelatedInfoService.search(searchTerm, this.tabItems.filter(item => item.name === tabName).shift());
  }
}
