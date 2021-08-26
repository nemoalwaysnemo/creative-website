import { Component, Input, TemplateRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DocumentModel } from '@core/api';
import { BaseSearchResultComponent } from '../base-search-result.component';
import { DocumentPageService } from '../../services/document-page.service';
import { DocumentListViewItem } from '../../document-list-view/document-list-view.interface';
import { GlobalDocumentDialogService, GlobalDocumentDialogSettings, GLOBAL_DOCUMENT_DIALOG } from '../../global-document-dialog';

@Component({
  template: `<a [routerLink]="['/p/business-development/Pitches/folder/', value.uid]">{{ value.title }}</a>
  `,
})
export class BizDevOpportunityRowRenderComponent {
  @Input() value: { title: string; uid: string };
}

@Component({
  selector: 'biz-dev-opportunity-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './biz-dev-opportunity-asset-search-result.component.html',
})
export class BizDevOpportunityAssetSearchResultComponent extends BaseSearchResultComponent {

  @Input() folderId: string;

  @Input()
  set selectedView(name: string) {
    this.currentView = name;
    if (!this.listViewSettings) {
      this.listViewSettings = this.defaultSettings;
    }
  }

  listViewSettings: any;

  dialogMetadata: any = {
    moreInfo: true,
    enablePreview: true,
    enableDetail: true,
    enableKnowledgeRelated: true,
  };

  dialogSettings: GlobalDocumentDialogSettings = new GlobalDocumentDialogSettings({ components: [GLOBAL_DOCUMENT_DIALOG.PREVIEW_BIZDEV_ASSET] });

  dialogTitle: string = 'Business Development';

  listViewBuilder: (docs: DocumentModel[]) => any = (docs: DocumentModel[]) => {
    const items = [];
    for (const doc of docs) {
      items.push(new DocumentListViewItem({
        uid: doc.uid,
        title: { title: doc.title, uid: doc.uid },
        type: doc.get('The_Loupe_Main:assettype'),
        productionDate: doc.get('The_Loupe_ProdCredits:production_date'),
        author: doc.get('The_Loupe_Main:created_by'),
      }));
    }
    return items;
  };

  private defaultSettings: any = {
    columns: {
      title: {
        title: 'Title',
        sort: false,
        type: 'custom',
        renderComponent: BizDevOpportunityRowRenderComponent,
      },
      type: {
        title: 'Type',
        sort: false,
      },
      productionDate: {
        title: 'Date',
        sort: false,
        valuePrepareFunction: (value: any) => {
          return value ? new DatePipe('en-US').transform(value, 'yyyy-MM-dd') : null;
        },
      },
      author: {
        title: 'Author',
        sort: false,
      },
      download: {
        title: 'Download',
        sort: false,
      },
    },
  };

  constructor(protected documentPageService: DocumentPageService,
    private globalDocumentDialogService: GlobalDocumentDialogService,
  ) {
    super(documentPageService);
  }

  protected onInit(): void {
    this.onQueryParamsChanged();
  }

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog);
  }

}
