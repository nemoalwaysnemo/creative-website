import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, timer } from 'rxjs';
import { DocumentModel } from '@core/api';
import { GlobalDocumentViewComponent, DocumentPageService, GlobalSearchFormSettings, SelectableItemSettings, SelectableActionBarSettings, SearchFilterModel } from '@pages/shared';
import { SelectableItemService } from '../../../shared/document-selectable';
import { NUXEO_DOC_TYPE, NUXEO_PATH_INFO } from '@environment/environment';
import { TAB_CONFIG } from '../creative-ring-tab-config';

@Component({
  selector: 'creative-ring-brand-asset',
  styleUrls: ['../../../../theme/styles/document-metadata-view.scss', './creative-ring-brand-asset.component.scss'],
  templateUrl: './creative-ring-brand-asset.component.html',
})
export class CreativeRingBrandAssetComponent extends GlobalDocumentViewComponent {

  baseParams$: Subject<any> = new Subject<any>();

  document: DocumentModel;

  collectionDocuments: any = null;

  tabConfig: any = TAB_CONFIG;

  loading: boolean = true;

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    new SearchFilterModel({ key: 'the_loupe_main_assettype_agg', placeholder: 'Asset Type' }),
  ];

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    enableQueryParams: true,
  });

  selectableSettings: SelectableItemSettings = new SelectableItemSettings({
    enableSelectable: true,
  });

  actionBarsettings: SelectableActionBarSettings = new SelectableActionBarSettings({
    enableAddToCollection: true,
    enableRemoveFromCollection: true,
    enableAddToFavorites: false,
  });

  constructor(
    private selectableItemService: SelectableItemService,
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
  ) {
    super(activatedRoute, documentPageService);
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    super.setCurrentDocument(doc);
    this.document = doc;
    if (doc && doc.get('collection:documentIds').length > 0) {
      timer(0).subscribe(() => { this.baseParams$.next(this.buildAssetsParams(doc)); });
      this.selectableItemService.clear();
    } else {
      this.loading = false;
    }
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path: NUXEO_PATH_INFO.CREATIVE_BASE_FOLDER_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_RING_COLLECTION_TYPE,
    };
  }

  protected buildAssetsParams(doc: DocumentModel): any {
    let params: any = {};
    params = {
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
      ecm_uuid: `["${doc.get('collection:documentIds').join('", "')}"]`,
      currentPageIndex: 0,
      ecm_fulltext: '',
    };
    return params;
  }
}
