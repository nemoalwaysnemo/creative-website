import { Component, OnInit, OnDestroy } from '@angular/core';
import { NuxeoPagination, DocumentModel, GlobalSearchParams, UserModel, NuxeoRequestOptions, NuxeoPermission } from '@core/api';
import { DocumentPageService } from '@pages/shared';
import { Subscription, combineLatest, Observable, of as observableOf, forkJoin, zip } from 'rxjs';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'creative-best-showcase',
  styleUrls: ['./creative-best-showcase.component.scss'],
  templateUrl: './creative-best-showcase.component.html',
})
export class CreativeBestShowcaseComponent implements OnInit, OnDestroy {

  layout: string = 'full-width agency';

  documents: DocumentModel[];

  loading: boolean = true;

  hasAgency: boolean = false;

  moreAgencies: boolean = false;

  companyCode: string;

  private subscription: Subscription = new Subscription();

  writePermission$: Observable<boolean> = observableOf(false);

  private params: any = {
    pageSize: 9,
    ecm_path: NUXEO_PATH_INFO.CREATIVE_SHOWCASE_ASSET_PATH,
    ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
  };

  constructor(
    protected documentPageService: DocumentPageService,
  ) {
  }

  ngOnInit(): void {
    this.search(this.params);
    this.getMyAgency();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getMyAgency(): void {
    const subscription = combineLatest([
      this.documentPageService.getCurrentUser(),
      this.searchAgencyDocument(this.getAgencyParams()),
    ]).subscribe(([user, docs]: [UserModel, DocumentModel[]]) => {
      const listNum = Object.keys(docs).length;
      if (user.companycode || listNum < 2) {
        this.hasAgency = true;
      }

      if (listNum > 1) {
        this.moreAgencies = true;
        this.writePermission$ = this.checkDocsHavePermission(docs);
      }
    });
    this.subscription.add(subscription);
  }

  private searchAgencyDocument(params: any = {}, opts?: NuxeoRequestOptions): Observable<DocumentModel[]> {
    return this.documentPageService.advanceRequest(params, opts)
      .pipe(
        map((res: NuxeoPagination) => res.entries),
      );
  }

  private getAgencyParams(): GlobalSearchParams {
    const params: any = {
      ecm_fulltext: '',
      currentPageIndex: 0,
      ecm_path: NUXEO_PATH_INFO.CREATIVE_TBWA_FOLDER_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_FOLDER_TYPE,
      the_loupe_main_folder_type: NUXEO_DOC_TYPE.CREATIVE_AGENCY_FOLDER_TYPE,
    };

    return new GlobalSearchParams(params);
  }

  private checkDocsHavePermission(docs: DocumentModel[]): Observable<boolean> {
    return forkJoin(
      docs.map((doc: DocumentModel) => zip(doc.hasPermission(NuxeoPermission.Write)),
      )).pipe(
        map((r: any[]) => {
          return r.map((b: boolean[]) => b.some((x: boolean) => x)).some((x: boolean) => x);
        }),
      );
  }

  private search(params: {}): void {
    const subscription = this.documentPageService.advanceRequest(new GlobalSearchParams(params))
      .subscribe((res: NuxeoPagination) => {
        this.documents = res.entries;
        this.loading = false;
      });
    this.subscription.add(subscription);
  }
}
