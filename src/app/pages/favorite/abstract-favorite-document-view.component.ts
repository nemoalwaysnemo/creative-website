import { OnInit } from '@angular/core';
import { DocumentModel, AdvanceSearch, UserService } from '@core/api';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { GlobalDocumentDialogService, SearchQueryParamsService, AbstractDocumentViewComponent } from '@pages/shared';

export abstract class AbstractFavoriteDocumentViewComponent extends AbstractDocumentViewComponent implements OnInit {

  baseParams$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService,
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected userService: UserService) {
    super(advanceSearch, activatedRoute, queryParamsService);
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

  protected abstract buildAssetsParams(doc: DocumentModel): object;

}
