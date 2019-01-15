import { Component, OnInit } from '@angular/core';
import { DocumentRelatedInfoService } from './document-related-info.service';

@Component({
  selector: 'tbwa-document-related-info',
  styleUrls: ['./document-related-info.component.scss'],
  templateUrl: './document-related-info.component.html',
})
export class DocumentRelatedInfoComponent implements OnInit {

  tabItems = [
    {
      name: 'Backslash',
      icon: 'nb-person',
      loading: false,
      params: {
        pageSize: 8,
        ecm_path: '/Creative/TBWA-/',
        ecm_primaryType: '["App-Library-Video"]',
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
        ecm_path: '/Creative/TBWA-/',
        ecm_primaryType: '["App-Library-Image"]',
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

  constructor(private documentRelatedInfoService: DocumentRelatedInfoService) { }

  ngOnInit() {
  }

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
