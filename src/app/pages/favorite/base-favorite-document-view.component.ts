import { OnInit } from '@angular/core';
import { DocumentModel, AdvanceSearchService, UserService } from '@core/api';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { GlobalDocumentDialogService, SearchQueryParamsService, GlobalDocumentViewComponent } from '@pages/shared';

export class BaseFavoriteDocumentViewComponent extends GlobalDocumentViewComponent implements OnInit {

  baseParams$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    protected advanceSearchService: AdvanceSearchService,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService,
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected userService: UserService) {
    super(advanceSearchService, activatedRoute, queryParamsService);
  }

  ngOnInit(): void {
    const subscription = this.getFavoriteDocument().subscribe();
    this.subscription.add(subscription);
  }

  protected getCurrentDocumentSearchParams(): any {
    return {};
  }

  protected setCurrentDocument(doc: DocumentModel) {
    if (doc) {
      this.baseParams$.next(this.buildAssetsParams(doc));
    }
  }

  protected getFavoriteDocument(): Observable<DocumentModel> {
    return this.userService.getFavoriteDocument().pipe(
      tap((doc: DocumentModel) => {
        this.loading = false;
        this.setCurrentDocument(doc);
      }),
    );
  }

  protected buildAssetsParams(doc: DocumentModel): object {
    return {};
  }

}
