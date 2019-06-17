import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Observable, of as observableOf, timer } from 'rxjs';
import { DocumentModel, AdvanceSearch, NuxeoPermission, NuxeoEnricher } from '@core/api';
import { AbstractDocumentViewComponent, SearchQueryParamsService, PreviewDialogService } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { TAB_CONFIG } from '../disruption-tab-config';

@Component({
  selector: 'disruption-theory-folder',
  styleUrls: ['./disruption-theory-folder.component.scss'],
  templateUrl: './disruption-theory-folder.component.html',
})
export class DisruptionTheoryFolderComponent extends AbstractDocumentViewComponent {

  tabs = TAB_CONFIG;

  baseParams$: Subject<any> = new Subject<any>();

  addChildrenPermission$: Observable<boolean> = observableOf(false);

  filters: any = {
    'the_loupe_main_agency_agg': { placeholder: 'Agency' },
    'app_edges_industry_agg': { placeholder: 'Industry' },
  };

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService,
    protected previewDialogService: PreviewDialogService) {
    super(advanceSearch, activatedRoute, queryParamsService);
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    this.document = doc;
    if (doc) {
      timer(0).subscribe(() => { this.baseParams$.next(this.buildAssetsParams(doc)); });
      if (!doc.hasFolderishChild) {
        this.addChildrenPermission$ = doc.hasPermission(NuxeoPermission.AddChildren);
      }
    }
  }

  protected getCurrentDocumentRequestParams(): any {
    return {
      enrichers: {
        document: [
          NuxeoEnricher.document.PREVIEW,
          NuxeoEnricher.document.THUMBNAIL,
          NuxeoEnricher.document.FAVORITES,
          NuxeoEnricher.document.PERMISSIONS,
          NuxeoEnricher.document.HAS_FOLDERISH_CHILD,
          NuxeoEnricher.document.HAS_CONTENT,
        ],
      },
    };
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path: NUXEO_PATH_INFO.DISRUPTION_THEORY_PATH,
      ecm_primaryType: NUXEO_META_INFO.DISRUPTION_THEORY_FOLDER_TYPE,
    };
  }

  protected buildAssetsParams(doc?: DocumentModel): any {
    if (doc.type === 'App-Disruption-Theory-Folder') {
      if (doc.hasFolderishChild) {
        return this.buildSubFolderParams(doc);
      } else {
        return this.buildTheoryAssetParams(doc);
      }
    }
    return {};
  }

  protected buildSubFolderParams(doc?: DocumentModel): any {
    const params = {
      ecm_primaryType: NUXEO_META_INFO.DISRUPTION_THEORY_FOLDER_TYPE,
      ecm_path: NUXEO_PATH_INFO.DISRUPTION_THEORY_PATH,
      currentPageIndex: 0,
      pageSize: 20,
      ecm_fulltext: '',
    };
    if (doc) {
      params['ecm_parentId'] = doc.uid;
    }
    return params;
  }

  protected buildTheoryAssetParams(doc?: DocumentModel): any {
    const params = {
      ecm_primaryType: NUXEO_META_INFO.DISRUPTION_THEORY_TYPE,
      ecm_path: NUXEO_PATH_INFO.DISRUPTION_THEORY_PATH,
      currentPageIndex: 0,
      pageSize: 20,
      ecm_fulltext: '',
    };
    if (doc) {
      params['ecm_parentId'] = doc.uid;
    }
    return params;
  }

  openForm(dialog: any): void {
    this.previewDialogService.open(dialog, this.document);
  }

  onCreated(doc: DocumentModel): void {
    this.refresh();
  }

}
