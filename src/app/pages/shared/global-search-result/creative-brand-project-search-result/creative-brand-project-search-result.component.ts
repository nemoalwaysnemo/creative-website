import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DocumentModel } from '@core/api';
import { DocumentListViewItem } from '../../document-list-view/document-list-view.interface';
import { BaseSearchResultComponent } from '../base-search-result.component';
import { DocumentPageService } from '../../services/document-page.service';

@Component({
  selector: 'creative-brand-project-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './creative-brand-project-search-result.component.html',
})
export class CreativeBrandProjectSearchResultComponent extends BaseSearchResultComponent {

  @Input()
  set selectedView(name: string) {
    this.currentView = name;
    if (!this.listViewSettings) {
      this.listViewSettings = this.defaultSettings;
    }
  }

  @Input() layout: string;

  @Input() resultHeader: string;

  @Input() hideEmpty: boolean = false;

  listViewSettings: any;

  private defaultSettings: any = {
    columns: {
      title: {
        title: 'Title',
        sort: false,
      },
      live_date: {
        title: 'Live Date',
        sort: false,
      },
      job_number: {
        title: 'Job Number',
        sort: false,
      },
    },
  };

  listViewBuilder: Function = (docs: DocumentModel[]): any => {
    const items = [];
    for (const doc of docs) {
      items.push(new DocumentListViewItem({
        uid: doc.uid,
        title: doc.title,
        live_date: doc.get('The_Loupe_Rights:first-airing') ? new DatePipe('en-US').transform(doc.get('The_Loupe_Rights:first-airing'), 'yyyy-MM-dd') : null,
        job_number: doc.get('The_Loupe_Main:jobnumber'),
      }));
    }
    return items;
  }

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  protected onInit(): void {
    this.onQueryParamsChanged();
  }
}
