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
        ecm_primaryType: NUXEO_META_INFO.LIBRARY_IMAGE_VIDEO_AUDIO_TYPES,
      },
    },
    {
      name: 'Distruption',
      layout: 'distruption',
      itemLayout: 'default',
      icon: 'nb-person',
      params: {
        pageSize: 8,
        ecm_primaryType: NUXEO_META_INFO.LIBRARY_IMAGE_VIDEO_AUDIO_TYPES,
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
