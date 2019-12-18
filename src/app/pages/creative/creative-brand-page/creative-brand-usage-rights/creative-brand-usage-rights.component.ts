import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { DocumentModel, AdvanceSearch, SearchFilterModel } from '@core/api';
import { AbstractDocumentViewComponent, SearchQueryParamsService } from '@pages/shared';
import { NUXEO_META_INFO } from '@environment/environment';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'creative-brand-usage-rights',
  styleUrls: ['../../../../theme/styles/document-metadata-view.scss'],
  templateUrl: './creative-brand-usage-rights.component.html',
})
export class CreativeBrandUsageRightsComponent extends AbstractDocumentViewComponent {

  baseParams$: Subject<any> = new Subject<any>();

  layout: string = 'creative-brand-usage-rights full-width';

  filters: SearchFilterModel[] = [];

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService) {
    super(advanceSearch, activatedRoute, queryParamsService);
  }

  protected onParamsChanged(): void {
    const subscription = this.getCurrentDocument(this.primaryKey, this.getCurrentDocumentSearchParams(), this.getCurrentDocumentRequestParams())
      .pipe(
        tap((doc: DocumentModel) => { this.document = doc; }),
        switchMap((brand: DocumentModel) => this.searchCurrentDocument(this.buildUsageRightsFolderParams(brand))),
      ).subscribe();
    this.subscription.add(subscription);
  }

  protected setCurrentDocument(doc?: DocumentModel): void {
    this.baseParams$.next(this.buildContractParams(doc));
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      ecm_primaryType: NUXEO_META_INFO.CREATIVE_FOLDER_TYPE,
      the_loupe_main_folder_type: NUXEO_META_INFO.CREATIVE_BRAND_FOLDER_TYPE,
    };
  }

  protected buildUsageRightsFolderParams(doc?: DocumentModel): any {
    const params = {
      pageSize: 1,
      ecm_primaryType: NUXEO_META_INFO.CREATIVE_UR_FOLDER_TYPE,
    };
    if (doc) {
      params['ecm_path'] = doc.path;
    }
    return params;
  }

  protected buildContractParams(doc?: DocumentModel): any {
    const params = {
      ecm_primaryType: NUXEO_META_INFO.CREATIVE_UR_CONTRACT_TYPES,
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
