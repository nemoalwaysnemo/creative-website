import { Component, Input, TemplateRef } from '@angular/core';
import { DocumentModel } from '@core/api';
import { DatePipe } from '@angular/common';
import { SelectableItemSettings } from '../../document-selectable';
import { DocumentPageService } from '../../services/document-page.service';
import { GLOBAL_DOCUMENT_FORM } from '../../global-document-form';
import { BaseSearchResultComponent } from '../base-search-result.component';
import { DocumentListViewItem } from '../../document-list-view/document-list-view.interface';
import { GLOBAL_DOCUMENT_DIALOG, GlobalDocumentDialogService, GlobalDocumentDialogSettings } from '../../../shared/global-document-dialog';

@Component({
  selector: 'creative-ring-brand-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './creative-ring-brand-asset-search-result.component.html',
})
export class CreativeRingBrandAssetSearchResultComponent extends BaseSearchResultComponent {

  @Input()
  set selectedView(name: string) {
    this.currentView = name;
    if (!this.listViewSettings) {
      this.listViewSettings = this.defaultSettings;
    }
  }

  constructor(
    protected documentPageService: DocumentPageService,
    private globalDocumentDialogService: GlobalDocumentDialogService,
  ) {
    super(documentPageService);
  }

  @Input() resultHeader: string = '';

  @Input() showDialog: boolean = false;

  @Input() loading: boolean = true;

  @Input() selectableSettings: SelectableItemSettings = new SelectableItemSettings({
    enableSelectable: false,
  });

  documents: DocumentModel[] = [];

  listViewSettings: any;

  dialogSettings: GlobalDocumentDialogSettings = new GlobalDocumentDialogSettings({
    components: [
      GLOBAL_DOCUMENT_DIALOG.PREVIEW_CREATIVE_RING_ASSET,
      GLOBAL_DOCUMENT_FORM.CREATIVE_RING_ASSET_FORM,
    ],
  });

  dialogTitle: string = 'Creative';

  private defaultSettings: any = {
    columns: {
      title: {
        title: 'Title',
        sort: false,
      },
      brand: {
        title: 'Brand',
        sort: false,
      },
      productionDate: {
        title: 'Production Date',
        sort: false,
        valuePrepareFunction: (value: any) => {
          return value ? new DatePipe('en-US').transform(value, 'yyyy-MM-dd') : null;
        },
      },
      campaign: {
        title: 'Campaign',
        sort: false,
      },
      ceativeDirector: {
        title: 'Creative Director',
        sort: false,
      },
      artDirector: {
        title: 'Art Director',
        sort: false,
      },
      jobNRUR: {
        title: 'Job Nr/UR',
        sort: false,
      },
    },
  };

  dialogMetadata: any = {
    formMode: 'edit',
    moreInfo: true,
    enablePreview: true,
    enableDetail: true,
    enableKnowledgeRelated: true,
  };

  listViewBuilder: (docs: DocumentModel[]) => any = (docs: DocumentModel[]) => {
    const items = [];
    for (const doc of docs) {
      items.push(new DocumentListViewItem({
        uid: doc.uid,
        title: { title: doc.title, uid: doc.uid },
        brand: doc.get('The_Loupe_Main:brand').join(', '),
        productionDate: doc.get('The_Loupe_ProdCredits:production_date'),
        campaign: doc.get('The_Loupe_Main:campaign_title_'),
        ceativeDirector: doc.get('The_Loupe_Credits:creativeDirector'),
        artDirector: doc.get('The_Loupe_Credits:artProducer'),
        jobNRUR: doc.get('The_Loupe_Main:jobnumber'),
      }));
    }
    return items;
  };

  protected onInit(): void {
    this.onQueryParamsChanged();
  }

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog);
  }

  searchResult(docs: DocumentModel[]): void {
    this.documents = docs;
  }

  protected getDefaultThumbnailViewSettings(): any {
    return {
      layout: 'ring_brand_asset full-width',
      enableShuffle: true,
    };
  }
}
