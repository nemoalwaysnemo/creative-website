import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentRepository, DocumentModel, NuxeoPagination, AdvanceSearch } from '@core/api';
import { takeWhile, tap, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { NUXEO_META_INFO } from '@environment/environment';

@Component({
  selector: 'tbwa-detail-page',
  styleUrls: ['./detail.component.scss'],
  templateUrl: './detail.component.html',
})
export class DetailComponent implements OnInit, OnDestroy {

  document: DocumentModel;

  private alive: boolean = true;

  private params: any = {
    pageSize: 1,
    ecm_path: NUXEO_META_INFO.BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_META_INFO.LIBRARY_DOC_TYPES,
  };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private advanceSearch: AdvanceSearch,
    private documentRepository: DocumentRepository) {

  }

  ngOnInit() {
    this.onQueryParamsChanged();
  }

  ngOnDestroy() {
    this.alive = false;
  }

  private getCurrentDocument(uid: string): Observable<NuxeoPagination> {
    const queryParams = Object.assign({}, this.params, { ecm_uuid: `["${uid}"]` });
    return this.advanceSearch.request(queryParams);
  }

  private getDocumentModel(uid: string): Observable<DocumentModel> {
    return this.documentRepository.get(uid);
  }

  private onQueryParamsChanged(): void {
    this.activatedRoute.queryParams
      .pipe(
        takeWhile(() => this.alive),
        tap(queryParams => {
          if (!this.verifyUID(queryParams.id)) {
            this.redirectTo404();
          }
        }),
        takeWhile(queryParams => this.verifyUID(queryParams.id)),
        distinctUntilChanged(),
        map(queryParams => queryParams.id),
        switchMap((uid: string) => this.getCurrentDocument(uid)),
        map((res: NuxeoPagination) => res.entries.shift()),
      )
      .subscribe((doc: DocumentModel) => {
        if (doc) {
          this.document = doc;
        } else {
          this.redirectTo404();
        }
      });
  }

  private verifyUID(uid: string): boolean {
    return uid && uid.length === 36;
  }

  private redirectTo404(): void {
    this.router.navigate(['/404']);
  }
}
