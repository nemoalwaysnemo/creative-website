import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { DocumentModel, AdvanceSearch, SearchFilterModel } from '@core/api';
import { AbstractDocumentViewComponent, SearchQueryParamsService } from '@pages/shared';
import { GlobalSearchFormSettings } from '@pages/shared/global-search-form/global-search-form.interface';
import { NUXEO_META_INFO } from '@environment/environment';

@Component({
  selector: 'creative-agency-showcase',
  styleUrls: ['../../../../theme/styles/document-metadata-view.scss'],
  templateUrl: './creative-agency-showcase.component.html',
})
export class CreativeAgencyShowcaseComponent extends AbstractDocumentViewComponent {

  baseParams$: Subject<any> = new Subject<any>();

  layout: string = 'creative_agency_showcase full-width';

  filters: SearchFilterModel[] = [];

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    enableSearchInput: false,
    enableQueryParams: true,
  });

  constructor(
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
      ecm_primaryType: NUXEO_META_INFO.CREATIVE_FOLDER_TYPE,
    };
  }

  protected buildAssetsParams(doc?: DocumentModel): any {
    const params = {
      ecm_primaryType: NUXEO_META_INFO.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
      app_global_networkshare: true,
      currentPageIndex: 0,
      pageSize: 20,
      ecm_fulltext: '',
    };
    if (doc) {
      params['ecm_path'] = doc.path;
    }
    return params;
  }
}
