import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, timer } from 'rxjs';
import { DocumentModel, GlobalSearchParams } from '@core/api';
import { GlobalDocumentViewComponent, DocumentPageService, GlobalSearchFormSettings, SelectableItemSettings, SelectableActionBarSettings, SearchFilterModel } from '@pages/shared';
import { SelectableItemService } from '../../../shared/document-selectable';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'creative-brand-asset',
  styleUrls: ['../../../../theme/styles/document-metadata-view.scss', './creative-brand-asset.component.scss'],

  templateUrl: './creative-brand-asset.component.html',
})
export class CreativeBrandAssetComponent extends GlobalDocumentViewComponent {

  baseParams$: Subject<any> = new Subject<any>();

  thumbnailViewSettings: any = {
    layout: 'creative_brand_asset full-width',
  };

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_campaign_agg', placeholder: 'Campaign', visibleFn: (searchParams: GlobalSearchParams): boolean => searchParams.hasParam('the_loupe_main_assettype_agg') || searchParams.hasParam('the_loupe_main_campaign_agg') }),
    new SearchFilterModel({ key: 'the_loupe_main_assettype_agg', placeholder: 'Asset Type' }),
    new SearchFilterModel({ key: 'app_edges_tags_edges_agg', placeholder: 'Edges' }),
  ];

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    enableQueryParams: true,
  });

  selectableSettings: SelectableItemSettings = new SelectableItemSettings({
    dataType: 'brand-asset-selectable',
    enableSelectable: true,
  });

  actionBarsettings: SelectableActionBarSettings = new SelectableActionBarSettings({
    enableAddToFavorites: true,
    enableAddToShowcase: true,
    enableDeleteDocuments: true,
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
    if (doc) {
      timer(0).subscribe(() => { this.baseParams$.next(this.buildAssetsParams(doc)); });
      this.selectableItemService.clear();
    }
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      ecm_path: this.documentPageService.getConfig('path:CREATIVE_TBWA_FOLDER_PATH'),
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_FOLDER_TYPE,
      the_loupe_main_folder_type: NUXEO_DOC_TYPE.CREATIVE_BRAND_FOLDER_TYPE,
    };
  }

  protected buildAssetsParams(doc: DocumentModel): any {
    const params: any = {
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
      currentPageIndex: 0,
      ecm_fulltext: '',
    };
    if (doc) {
      params['ecm_path'] = doc.path;
    }
    return params;
  }
}
