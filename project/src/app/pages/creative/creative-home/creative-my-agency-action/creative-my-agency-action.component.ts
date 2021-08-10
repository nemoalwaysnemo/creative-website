import { Component, OnInit, OnDestroy } from '@angular/core';
import { NuxeoPagination, DocumentModel, GlobalSearchParams, UserModel, NuxeoRequestOptions, NuxeoPermission } from '@core/api';
import { DocumentPageService } from '@pages/shared';
import { Subscription, combineLatest, Observable, of as observableOf, forkJoin, zip } from 'rxjs';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';
import { map } from 'rxjs/operators';

@Component({
  selector: 'creative-my-agency-action',
  styleUrls: ['./creative-my-agency-action.component.scss'],
  templateUrl: './creative-my-agency-action.component.html',
})
export class CreativeMyAgencyActionComponent implements OnInit, OnDestroy {

  hasAgency: boolean = false;

  moreAgencies: boolean = false;

  writePermission$: Observable<boolean> = observableOf(false);

  private subscription: Subscription = new Subscription();

  constructor(protected documentPageService: DocumentPageService) {
  }

  ngOnInit(): void {
    this.checkMyAgency();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private checkMyAgency(): void {
    const subscription = combineLatest([
      this.documentPageService.getCurrentUser(),
      this.searchAgencyDocument(this.getAgencyParams()),
    ]).subscribe(([user, docs]: [UserModel, DocumentModel[]]) => {
      if (user.companycode || docs.length < 2) {
        this.hasAgency = true;
      }
      if (docs.length > 1) {
        this.moreAgencies = true;
        this.writePermission$ = this.checkDocsHavePermission(docs);
      }
    });
    this.subscription.add(subscription);
  }

  private searchAgencyDocument(params: any = {}, opts?: NuxeoRequestOptions): Observable<DocumentModel[]> {
    return this.documentPageService.advanceRequest(params, opts)
      .pipe(map((res: NuxeoPagination) => res.entries));
  }

  private getAgencyParams(): GlobalSearchParams {
    const params: any = {
      ecm_fulltext: '',
      pageSize: 2,
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

}
