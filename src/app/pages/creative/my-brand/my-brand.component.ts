import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentModel, NuxeoPagination, AdvanceSearch } from '@core/api';
import { takeWhile, tap, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { NUXEO_META_INFO } from '@environment/environment';
import { isDocumentUID } from '@core/services';
import { BrandService } from './brand.service';

@Component({
  selector: 'tbwa-my-brand-page',
  styleUrls: ['./my-brand.component.scss'],
  templateUrl: './my-brand.component.html',
})
export class MyBrandComponent implements OnInit, OnDestroy {
  document: DocumentModel;
  brandMessage: { title, client, brand, agency, country, file, path } = { title: '', client: '', brand: '', agency: '', country: '', file: '', path: '' };

  private subscription: Subscription = new Subscription();

  private params: any = {
    pageSize: 1,
    ecm_primaryType: NUXEO_META_INFO.CREATIVE_FOLDER_TYPES,
  };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private advanceSearch: AdvanceSearch,
    private brandService: BrandService) {
  }

  ngOnInit() {
    this.onQueryParamsChanged();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private initBrandMessage() {
    this.brandMessage = {
      title: this.document.title,
      agency: this.document.properties['The_Loupe_Main:agency'],
      client: this.document.properties['The_Loupe_Main:clientName'],
      brand: this.document.properties['The_Loupe_Main:brand'],
      country: this.document.properties['The_Loupe_Main:country'],
      file: this.document.filePath,
      path: this.document.path,
    };
    if (!this.brandService.hasBrand() || this.document.uid !== this.brandService.brand.uid) {
      this.brandService.brand = this.document;
      this.brandService.changeMessage(this.brandMessage);
    }
  }

  private getCurrentDocument(uid: string): Observable<NuxeoPagination> {
    const queryParams = Object.assign({}, this.params, { ecm_uuid: `["${uid}"]` });
    return this.advanceSearch.request(queryParams);
  }

  private onQueryParamsChanged(): void {
    const subscription = this.activatedRoute.queryParams
      .pipe(
        tap(queryParams => {
          if (!isDocumentUID(queryParams.id)) {
            this.redirectTo404();
          }
        }),
        takeWhile(queryParams => isDocumentUID(queryParams.id)),
        distinctUntilChanged(),
        map(queryParams => queryParams.id),
        switchMap((uid: string) => this.getCurrentDocument(uid)),
        map((res: NuxeoPagination) => res.entries.shift()),
      )
      .subscribe((doc: DocumentModel) => {
        if (doc) {
          this.document = doc;
          this.initBrandMessage();
        } else {
          this.redirectTo404();
        }
      });
    this.subscription.add(subscription);
  }

  private redirectTo404(): void {
    this.router.navigate(['/p/error/404']);
  }
}
