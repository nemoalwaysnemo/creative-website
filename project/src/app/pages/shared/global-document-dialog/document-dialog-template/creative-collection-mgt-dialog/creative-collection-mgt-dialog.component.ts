import { Component } from '@angular/core';
import { DocumentModel, NuxeoAutomations, NuxeoPermission, SearchResponse } from '@core/api';
import { Observable, forkJoin, zip, Subject, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { DocumentPageService } from '../../../services/document-page.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { DocumentDialogCustomTemplateComponent } from '../../document-dialog-custom-template.component';
import { GlobalSearchFormSettings } from '../../../global-search-form/global-search-form.interface';
import { SearchFilterModel } from '../../../global-search-filter/global-search-filter.interface';
import { SelectableItemSettings, SelectableItemService, SelectableItemEvent } from '../../../../shared/document-selectable/';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'creative-collection-mgt-dialog',
  styleUrls: ['../global-document-dialog-template.scss', './creative-collection-mgt-dialog.component.scss'],
  templateUrl: './creative-collection-mgt-dialog.component.html',
})
export class CreativeCollectionMgtDialogComponent extends DocumentDialogCustomTemplateComponent {

  documents: DocumentModel[] = [];

  targetCollection: any;

  parentDocument: DocumentModel;

  append: boolean = false;

  baseParams$: Subject<any> = new Subject<any>();

  searchFormSettings: GlobalSearchFormSettings;

  thumbnailViewSettings: any = {
    customGridTitle: 'New Collection',
    enableCustomGrid: true,
    layout: 'ring_brand_asset',
  };

  selectableSettings: SelectableItemSettings = new SelectableItemSettings({
    dataType: 'collection-view-selectable',
    enableSelectable: true,
    queueLimit: 1,
  });

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    new SearchFilterModel({ key: 'the_loupe_main_assettype_agg', placeholder: 'Asset Type' }),
  ];

  searchResultFilter(res: SearchResponse): boolean {
    return res.source === 'creative-collections-mgt';
  }

  constructor(
    private selectableItemService: SelectableItemService,
    protected documentPageService: DocumentPageService,
    protected globalDocumentDialogService: GlobalDocumentDialogService,
  ) {
    super(globalDocumentDialogService, documentPageService);
    this.subscribeDialogEvents();
  }

  protected onInit(): void {
    if (this.dialogSettings.documents) {
      const subscription = this.getValidDocuments(this.dialogSettings.documents).subscribe((docs: DocumentModel[]) => this.documents = docs);
      this.subscription.add(subscription);
    }
    this.getParentDocument();
    this.triggerSearch();
  }

  addToCollection(): void {
    const collection: any = this.targetCollection ? this.targetCollection.shift() : '';
    const assetIds: string[] = this.documents.map((doc: DocumentModel) => doc.uid);
    if (collection && assetIds.length > 0) {
      const subscription = this.documentPageService.operation(NuxeoAutomations.AddToCollection, { collection: collection.uid }, assetIds).subscribe(_ => {
        this.globalDocumentDialogService.close();
        this.selectableItemService.clear();
        this.documentPageService.notify('Added to Collection successfully!', '', 'success');
        this.refresh(this.documentPageService.getCurrentUrl());
      });
      this.subscription.add(subscription);
    }
  }

  onLoadMore(res: SearchResponse): void {
    this.append = true;
    const params = this.buildAssetsParams();
    params['currentPageIndex'] = res.response.currentPageIndex + 1;
    params['pageSize'] = 4;
    this.baseParams$.next(res.searchParams.setParams(params));
  }

  onResponse(res: SearchResponse): void {
    if (res.source === 'creative-collections-mgt') {
      this.append = false;
    }
  }

  getParentDocument(): void {
    this.documentPageService.operation(NuxeoAutomations.GetDocument, { uuid: this.document.parentRef }).subscribe((doc: DocumentModel) => {
      this.parentDocument = doc;
    });
  }

  openDialog(name: string): void {
    const formSettings = this.getDialogSettings().formSettings ? this.getDialogSettings().formSettings : {
      selectedDocuments: this.documents,
      formType: 'add',
    };
    const document = this.parentDocument ;
    this.selectView(name, null, { formSettings, document });
  }

  private triggerSearch(): void {
    this.searchFormSettings = new GlobalSearchFormSettings({
      source: 'creative-collections-mgt',
      enableQueryParams: false,
    });
    timer(0).subscribe(() => { this.baseParams$.next(this.buildAssetsParams()); });
  }

  protected buildAssetsParams(): any {
    const params: any = {
      currentPageIndex: 0,
      ecm_fulltext: '',
      ecm_path: this.documentPageService.getConfig('path:CREATIVE_BASE_FOLDER_PATH'),
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_RING_COLLECTION_TYPE,
      the_loupe_main_collection_type: NUXEO_DOC_TYPE.CREATIVE_RING_ASSET_COLLECTION_TYPE,
    };
    return params;
  }

  private getValidDocuments(docs: DocumentModel[]): Observable<DocumentModel[]> {
    return forkJoin(
      docs.map((doc: DocumentModel) => zip(doc.hasPermission(NuxeoPermission.Write)),
      )).pipe(
      map((r: any[]) => {
        const list = [];
        r.forEach((b: boolean[], i: number) => { if (b.every((x: boolean) => x)) { list.push(docs[i]); } });
        return list;
      }),
    );
  }

  private disableCustomGridView(): void {
    const opts: any = {};
    if ((this.targetCollection || []).length > 0) {
      opts.disableCustomGrid = true;
    } else {
      opts.disableCustomGrid = false;
    }
    this.thumbnailViewSettings = Object.assign({}, this.thumbnailViewSettings, opts);
  }

  protected subscribeDialogEvents(): void {
    // this.subscribeDialogBuiltInEvents();
    this.subscribeEvents();
  }

  private subscribeEvents(): void {
    const subscription1 = this.selectableItemService.onEvent('collection-view-selectable').pipe(
      map((event: SelectableItemEvent) => event.collection),
    ).subscribe((collection: DocumentModel[]) => {
      this.targetCollection = collection;
      this.disableCustomGridView();
    });
    this.subscription.add(subscription1);
    const subscription2 = this.documentPageService.onEvent('CustomGridClick').pipe(
    ).subscribe(_ => {
      this.openDialog('creative-ring-collection-form');
    });
    this.subscription.add(subscription2);
  }
}
