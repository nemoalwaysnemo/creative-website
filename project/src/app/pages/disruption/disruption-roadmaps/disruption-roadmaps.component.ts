import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentModel, NuxeoQuickFilters, SearchFilterModel } from '@core/api';
import { GlobalDocumentViewComponent, DocumentPageService, GlobalSearchFormSettings } from '@pages/shared';
import { TAB_CONFIG } from '../disruption-tab-config';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'disruption-roadmap',
  styleUrls: ['./disruption-roadmaps.component.scss'],
  templateUrl: './disruption-roadmaps.component.html',
})
export class DisruptionRoadmapsComponent extends GlobalDocumentViewComponent implements OnInit {

  onSearching: boolean = true;

  currentView: string = 'allRoadmapsView';

  enableScrolling: any = { allRoadmapsView: true, featuredRoadmapsView: true };

  tabs: any[] = TAB_CONFIG;

  protected enabledView: any = { allRoadmapsView: true };

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    new SearchFilterModel({ key: 'app_edges_industry_agg', placeholder: 'Industry', iteration: true }),
  ];

  defaultParams: any = {
    currentPageIndex: 0,
    ecm_fulltext: '',
    ecm_primaryType: NUXEO_DOC_TYPE.DISRUPTION_ROADMAP_TYPE,
    ecm_path: NUXEO_PATH_INFO.DISRUPTION_ROADMAPS_PATH,
    quickFilters: NuxeoQuickFilters.Alphabetically,
  };

  featuredParams: any = {
    currentPageIndex: 0,
    ecm_fulltext: '',
    app_edges_featured_asset: true,
    ecm_path: NUXEO_PATH_INFO.DISRUPTION_ROADMAPS_PATH,
    ecm_primaryType: NUXEO_DOC_TYPE.DISRUPTION_ROADMAP_TYPE,
  };

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    enableQueryParams: true,
  });

  featuredSearchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    source: 'document-featured-roadmpaps',
    enableQueryParams: true,
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
  ) {
    super(activatedRoute, documentPageService);
  }

  ngOnInit(): void {
    const subscription = this.searchCurrentDocument(this.getCurrentDocumentSearchParams()).subscribe();
    this.subscription.add(subscription);
  }

  onLoading(loading: boolean): void {
    this.onSearching = loading;
  }

  selectView(view: string): void {
    if (!this.onSearching) {
      this.performViewTemplate(view);
    }
  }

  isViewEnabled(name: string): boolean {
    return this.enabledView[name];
  }

  protected performViewTemplate(name: string): void {
    this.currentView = name;
    if (!this.enabledView[name]) {
      this.enabledView[name] = true;
    }
    for (const key in this.enableScrolling) {
      if (key === name) {
        this.enableScrolling[key] = true;
      } else {
        this.enableScrolling[key] = false;
      }
    }
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    super.setCurrentDocument(doc);
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path: NUXEO_PATH_INFO.DISRUPTION_ROADMAPS_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.DISRUPTION_ROADMAP_FOLDER_TYPE,
    };
  }

}
