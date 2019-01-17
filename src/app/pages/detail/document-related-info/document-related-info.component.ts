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
      icon: 'nb-person',
      loading: false,
      params: {
        pageSize: 8,
        ecm_primaryType: NUXEO_META_INFO.LIBRARY_IMAGE_VIDEO_AUDIO_TYPES,
      },
    },
    // {
    //   name: 'Distruption',
    //   icon: 'nb-person',
    //   loading: false,
    //   params: {
    //     pageSize: 8,
    //     ecm_path: '/Creative/TBWA-/',
    //     ecm_primaryType: '["App-Library-Image"]',
    //   },
    // },
    // {
    //   name: 'Knowledge',
    //   icon: 'nb-person',
    //   loading: false,
    //   params: {
    //     pageSize: 8,
    //     ecm_path: '/Creative/TBWA-/',
    //     ecm_primaryType: '["App-Library-Image"]',
    //   },
    // },
    {
      name: 'Awards',
      icon: 'nb-person',
      loading: false,
      params: {
        pageSize: 8,
        ecm_path: NUXEO_META_INFO.BASE_FOLDER_PATH,
        ecm_primaryType: NUXEO_META_INFO.LIBRARY_IMAGE_VIDEO_AUDIO_TYPES,
      },
    },
    // {
    //   name: 'Lorern Ipsum',
    //   icon: 'nb-person',
    //   loading: false,
    //   params: {
    //     pageSize: 8,
    //     ecm_path: '/Creative/TBWA-/',
    //     ecm_primaryType: '["App-Library-Image"]',
    //   },
    // },
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
