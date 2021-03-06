import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';
import { DocumentListViewItem } from '../../document-list-view/document-list-view.interface';
import { BaseSearchResultComponent } from '../base-search-result.component';
import { DocumentPageService } from '../../services/document-page.service';

@Component({
  selector: 'creative-usage-rights-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './creative-usage-rights-search-result.component.html',
})
export class CreativeUsageRightsSearchResultComponent extends BaseSearchResultComponent {

  @Input()
  set selectedView(name: string) {
    this.currentView = name;
    if (!this.listViewSettings) {
      this.listViewSettings = this.defaultSettings;
    }
  }

  @Input() resultHeader: string;

  listViewSettings: any;

  private defaultSettings: any = {
    columns: {
      title: {
        title: 'Title',
        sort: false,
      },
      // project: {
      //   title: 'Project',
      //   sort: false,
      // },
      // usageTypes: {
      //   title: 'Usage Types',
      //   sort: false,
      // },
      // contractCountries: {
      //   title: 'Contract Countries',
      //   sort: false,
      // },
      // startDate: {
      //   title: 'Start-Date',
      //   sort: false,
      // },
      // duration: {
      //   title: 'Duration',
      //   sort: false,
      // },
    },
  };

  listViewBuilder: (docs: DocumentModel[]) => any = (docs: DocumentModel[]) => {
    const items = [];
    for (const doc of docs) {
      items.push(new DocumentListViewItem({
        uid: doc.uid,
        title: doc.title,
        // project: doc.get('The_Loupe_Main:jobtitle_'),
        // usageTypes: doc.get('The_Loupe_ProdCredits:production_date'),
        // contractCountries: doc.get('The_Loupe_Main:country'),
        // startDate: doc.get('The_Loupe_Credits:creativeDirector'),
        // duration: doc.get('The_Loupe_Credits:artProducer'),
      }));
    }
    return items;
  };

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  protected onInit(): void {
    this.onQueryParamsChanged();
  }
}
