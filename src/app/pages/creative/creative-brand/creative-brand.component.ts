import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { DocumentModel, AdvanceSearch, SearchFilterModel } from '@core/api';
import { AbstractDocumentViewComponent, SearchQueryParamsService, PreviewDialogService } from '@pages/shared';
import { NUXEO_META_INFO } from '@environment/environment';

@Component({
  selector: 'creative-brand',
  styleUrls: ['../../../theme/styles/document-metadata-view.scss'],
  templateUrl: './creative-brand.component.html',
})
export class CreativeBrandComponent extends AbstractDocumentViewComponent {
  brand_id = this.activatedRoute.snapshot.params.id;

  tabs: any[] = [
    {
      title: 'Showcase',
      route: '/p/creative/brand/' + this.brand_id + '/showcase',
    },
    {
      title: 'Campaigns & Projects',
      route: '/p/creative/brand/' + this.brand_id + '/campaigns',
    },
    {
      title: 'Usage Rights',
      route: '/p/creative/brand/' + this.brand_id + '/urs',
    },
    {
      title: 'Manage Library',
      route: '/p/creative/brand/' + this.brand_id + '/library',
    },
    {
      title: 'Manage Lists',
      route: '/p/creative/brand/' + this.brand_id + '/folder',
    },
  ];


  baseParams$: Subject<any> = new Subject<any>();

  layout: string = 'my_brand_asset_search full-width';

  showType: string;

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_campaign_agg', placeholder: 'Campaign', convertTitle: true }),
    // new SearchFilterModel({ key: 'the_loupe_main_brand_agg', placeholder: 'Brand' }),
    // new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    // new SearchFilterModel({ key: 'the_loupe_main_country_agg', placeholder: 'County', iteration: true }),
    new SearchFilterModel({ key: 'the_loupe_main_assettype_agg', placeholder: 'Asset Type' }),
    // new SearchFilterModel({ key: 'the_loupe_main_clientName_agg', placeholder: 'Client' }),
    // new SearchFilterModel({ key: 'app_edges_industry_agg', placeholder: 'Industry', iteration: true }),
    // new SearchFilterModel({ key: 'app_edges_backslash_category_agg', placeholder: 'Category' }),
    new SearchFilterModel({ key: 'app_edges_tags_edges_agg', placeholder: 'Edges' }),
    new SearchFilterModel({ key: 'the_loupe_prodCredits_production_date_agg', placeholder: 'Year', filterValue: (bucket: any) => bucket.docCount > 0 }),
    new SearchFilterModel({ key: 'app_global_networkshare_agg', placeholder: 'Showcase', optionLabels: { 'true': 'Yes', 'false': 'No' } }),
  ];

  constructor(
    protected previewDialogService: PreviewDialogService,
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService) {
    super(advanceSearch, activatedRoute, queryParamsService);
  }

  protected setCurrentDocument(doc?: DocumentModel): void {
    this.document = doc;
    this.baseParams$.next(this.buildAssetsParams(doc));
  }
  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      ecm_primaryType: NUXEO_META_INFO.CREATIVE_FOLDER_TYPES,
    };
  }

  protected buildAssetsParams(doc?: DocumentModel): any {
    const params = {
      ecm_primaryType: NUXEO_META_INFO.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
      currentPageIndex: 0,
      pageSize: 20,
      ecm_fulltext: '',
    };
    if (doc) {
      params['ecm_path'] = doc.path;
    }
    return params;
  }

  openDialog(dialog: any, type): void {
    this.showType = type;
    // this.previewDialogService.open(dialog, this.document, { type: this.document.type });
    this.previewDialogService.open(dialog, this.document);
  }
}
