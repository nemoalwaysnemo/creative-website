import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AdvanceSearchService, DocumentModel, NuxeoAutomations, NuxeoPagination, SearchResponse } from '@core/api';
import { DocumentPageService } from '../../../services/document-page.service';
import { GlobalSearchFormSettings } from '../../../global-search-form/global-search-form.interface';
import { ListSearchRowCustomViewSettings } from '../../../list-search-form/list-search-form.interface';
import { ListSearchRowCustomViewComponent } from '../../../list-search-form-in-dialog/list-search-row-custom-view-component';
import { NUXEO_DOC_TYPE } from '@environment/environment';
import { DocumentListViewItem } from '../../../document-list-view/document-list-view.interface';
import { DatePipe } from '@angular/common';
import { vocabularyFormatter } from '@core/services/helpers';
import { Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  template: `
    <ng-container *ngIf="value" [ngSwitch]="true">
      <ng-container *ngFor="let type of value.mediatypes">
        <div class="asset-mediatype">
          <span>{{type}}</span>
        </div>
      </ng-container>
        <div class="asset-country">
          <span>{{value.countries}}</span>
        </div>
    </ng-container>
  `,
})
export class DocumentCreativeProjectAssetRowRenderComponent {
  @Input() value: { mediatypes: any; countries: string };
}

@Component({
  selector: 'document-creative-project-assets-list',
  styleUrls: ['../../document-creative-project-mgt.component.scss', '../document-creative-project-usage-rights-page.component.scss'],
  template: '<list-search-form-in-dialog [searchParams]="defaultParams" [settings]="searchFormSettings" [listViewSettings]="listViewSettings" [listViewBuilder]="listViewBuilder" (rowSelect)="formatAsset($event)" [afterSearch]="afterSearch"></list-search-form-in-dialog>',
})
export class DocumentCreativeProjectAssetsListComponent {

  usageRights: any = {};

  loading: boolean = true;

  contractUid: any = [];

  defaultParams: any = {
    ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
    currentPageIndex: 0,
    ecm_fulltext: '',
  };

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    schemas: ['dublincore', 'The_Loupe_Main', 'The_Loupe_Credits', 'The_Loupe_ProdCredits', 'The_Loupe_Rights'],
    source: 'document-creative-project-asset',
    enableSearchForm: false,
    autoSearch: false,
  });

  listViewSettings: any = {
    hideHeader: false,
    selectMode: 'multi',
    hideSubHeader: true,
    showCheckbox: true,
    columns: {
      action: {
        sort: false,
        type: 'custom',
        renderComponentData: new ListSearchRowCustomViewSettings({
          viewType: 'thumbnail',
          enableDialog: true,
        }),
        renderComponent: ListSearchRowCustomViewComponent,
      },
      title: {
        title: 'Title',
        sort: false,
      },
      type: {
        title: 'Asset Type',
        sort: false,
      },
      date: {
        title: 'Airing Date',
        sort: false,
        valuePrepareFunction: (value: any) => {
          return value ? new DatePipe('en-US').transform(value, 'yyyy-MM-dd') : null;
        },
      },
      coverage: {
        title: 'Coverage',
        sort: false,
        type: 'custom',
        renderComponent: DocumentCreativeProjectAssetRowRenderComponent,
      },
      usageRights: {
        title: 'Status',
        sort: false,
        type: 'custom',
        renderComponentData: new ListSearchRowCustomViewSettings({
          viewType: 'usage-rights-expiry',
        }),
        renderComponent: ListSearchRowCustomViewComponent,
      },
    },
  };

  @Output() selectDocuments: EventEmitter<DocumentModel[]> = new EventEmitter<DocumentModel[]>();

  @Input()
  set document(doc: DocumentModel) {
    this.loading = false;
  }

  @Input() assets: DocumentModel[];

  listViewBuilder: (docs: DocumentModel[]) => any = (docs: DocumentModel[]) => {
    // console.log(docs);
    // const list = [docs[0], docs[1]];
    const items = [];
    for (const doc of docs) {
      items.push(new DocumentListViewItem({
        uid: doc.uid,
        action: doc,
        title: doc.title,
        type: doc.get('The_Loupe_Main:assettype'),
        date: doc.get('The_Loupe_Rights:first-airing'),
        coverage: { mediatypes: doc.get('The_Loupe_Rights:contract_mediatypes'), countries: vocabularyFormatter(doc.get('The_Loupe_Rights:asset_countries')) },
        usageRights: doc.get('_usage_rights_'),
      }));
    }
    return items;
  };

  constructor(
    protected documentPageService: DocumentPageService,
    private advanceSearchService: AdvanceSearchService,
  ) { }

  formatAsset(row: any): void {
    const items = [];
    for (const item of row.selected) {
      items.push(item.action);
    }
    this.selectDocuments.emit(items);
  }

  vocabularyFormatter(list: string[]): string {
    return vocabularyFormatter(list);
  }

  afterSearch: (res: SearchResponse) => Observable<SearchResponse> = (res: SearchResponse) => {
    return this.getUsageRightsStatus(res);
  };

  private getUsageRightsStatus(res: SearchResponse): Observable<SearchResponse> {
    const uids: string[] = res.response.entries.map((doc: DocumentModel) => doc.uid);
    if (uids.length > 0) {
      return this.advanceSearchService.operation(NuxeoAutomations.GetDocumentURStatus, { uuids: `${uids.join(',')}`, entityType: 'asset' }).pipe(
        map((response: NuxeoPagination) => {
          res.response.entries.forEach((doc: DocumentModel) => {
            const status = response.entries.find((x: any) => x.uuid === doc.uid);
            doc.properties['_usage_rights_'] = status || {};
          });
          return res;
        }),
      );
    }
    return observableOf(res);
  }
}
