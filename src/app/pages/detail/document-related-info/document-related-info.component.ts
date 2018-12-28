import { Component, OnInit } from '@angular/core';
import { DocumentRelatedInfoService } from './document-related-info.service';
import { NuxeoPagination } from '@core/api';

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
    },
    {
      name: 'Distruption',
      icon: 'nb-person',
    },
    {
      name: 'Knowledge',
      icon: 'nb-person',
    },
    {
      name: 'Awards',
      icon: 'nb-person',
    },
    {
      name: 'Lorern Ipsum',
      icon: 'nb-person',
    },
  ];

  constructor(private documentRelatedInfoService: DocumentRelatedInfoService) { }

  ngOnInit() {
  }

  onChangTab(tab: any): void {
    for (const tabItem of this.tabItems) {
      if (tabItem.name === tab.tabTitle) {
        this.documentRelatedInfoService.get(tab.tabTitle)
          .subscribe((res: NuxeoPagination) => {
            this.documentRelatedInfoService.changeTab({ tag: tab.tabTitle, documents: res.entries });
          });
      }
    }
  }
}
