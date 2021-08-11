import { Component, Input } from '@angular/core';
import { DocumentModel, NuxeoPermission } from '@core/api';
import { DocumentPageService, GlobalSearchFormSettings, SearchFilterModel } from '@pages/shared';
import { Observable, of as observableOf } from 'rxjs';
import { NUXEO_DOC_TYPE, Environment } from '@environment/environment';

@Component({
  selector: 'backslash-home-thumbnail',
  styleUrls: ['./backslash-home-thumbnail.component.scss'],
  templateUrl: './backslash-home-thumbnail.component.html',
})
export class BackslashHomeThumbnailComponent {

  doc: DocumentModel;

  onSearching: boolean = true;

  currentView: string = 'liveView';

  selectedView: string = 'thumbnailView';

  writePermission$: Observable<boolean> = observableOf(false);

  enableScrolling: any = { liveView: true, pipeLineView: true };

  thumbnailViewSettings: any = {
    layout: 's-results my_agency dates full-width backslash_asset_search',
  };

  oldBackslashUrl = Environment.backslashAppUrl;

  defaultParams: any = {
    currentPageIndex: 0,
    pageSize: 12,
    ecm_fulltext: '',
    app_edges_active_article: true,
    ecm_path: this.documentPageService.getConfig('path:BACKSLASH_BASE_FOLDER_PATH'),
    ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_ARTICLE_VIDEO_POST_TYPES,
  };

  pipeLineParams: any = {
    currentPageIndex: 0,
    ecm_fulltext: '',
    app_edges_active_article: false,
    ecm_path: this.documentPageService.getConfig('path:BACKSLASH_BASE_FOLDER_PATH'),
    ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_ARTICLE_VIDEO_POST_TYPES,
  };

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    enableQueryParams: false,
  });

  pipeLineSearchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    source: 'document-backslash-pipeline',
    enableQueryParams: false,
  });

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'app_edges_tags_edges_agg', placeholder: 'Edges' }),
    new SearchFilterModel({ key: 'app_edges_backslash_category_agg', placeholder: 'Category' }),
    new SearchFilterModel({ key: 'app_edges_backslash_type_agg', placeholder: 'Type' }),
    new SearchFilterModel({ key: 'the_loupe_main_brand_agg', placeholder: 'Brand' }),
    new SearchFilterModel({ key: 'app_edges_relevant_country_agg', placeholder: 'Geography', iteration: true }),
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    new SearchFilterModel({ key: 'the_loupe_main_country_agg', placeholder: 'Agency Country', iteration: true }),
  ];

  protected enabledView: any = { liveView: true };

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.doc = doc;
      this.writePermission$ = doc.hasPermission(NuxeoPermission.Write);
    }
  }

  constructor(
    private documentPageService: DocumentPageService,
  ) {
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

}
