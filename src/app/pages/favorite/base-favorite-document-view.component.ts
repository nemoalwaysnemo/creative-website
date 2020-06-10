import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject, timer } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DocumentModel, UserService } from '@core/api';
import { GlobalDocumentDialogService, DocumentPageService, GlobalDocumentViewComponent } from '@pages/shared';

@Component({
  template: '',
})
export class BaseFavoriteDocumentViewComponent extends GlobalDocumentViewComponent {

  baseParams$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
    protected globalDocumentDialogService: GlobalDocumentDialogService,
  ) {
    super(activatedRoute, documentPageService);
  }

  onInit(): void {
    const subscription = this.getFavoriteDocument().subscribe();
    this.subscription.add(subscription);
  }

  protected getCurrentDocumentSearchParams(): any {
    return {};
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    this.documentPageService.setCurrentDocument(doc);
    if (doc) {
      timer(0).subscribe(() => { this.baseParams$.next(this.buildAssetsParams(doc)); });
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
