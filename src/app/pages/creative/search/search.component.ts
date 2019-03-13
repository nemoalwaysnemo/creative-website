import { Component, OnInit, OnDestroy } from '@angular/core';
import { SearchQueryParamsService } from '@pages/shared';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tbwa-search-page',
  styleUrls: ['./search.component.scss'],
  templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit, OnDestroy {

  constructor(private queryParamsService: SearchQueryParamsService) { }

  private subscription: Subscription = new Subscription();
  private pageType: string = '';


  ngOnInit() {
    this.onQueryParamsChanged();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  private onQueryParamsChanged() {
    const subscription = this.queryParamsService.onQueryParamsChanged().subscribe(params => {
      this.pageType = params['type'];
    });
    this.subscription.add(subscription);
  }

  isAssetPage(): boolean {
    return !this.pageType || this.pageType === 'asset';
  }

  isBrandPage(): boolean {
    return this.pageType === 'brand';
  }

  isRecommendBrandPage(): boolean {
    return this.pageType === 'recommendBrand';
  }
}
