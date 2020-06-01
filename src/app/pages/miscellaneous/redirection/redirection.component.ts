import { Component, OnDestroy } from '@angular/core';
import { DocumentPageService } from '@pages/shared';
import { map, filter, concatMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'page-redirection',
  template: ``,
})
export class RedirectionComponent implements OnDestroy {

  private subscription: Subscription = new Subscription();

  constructor(private searchQueryParamsService: DocumentPageService) {
    this.subscription = this.searchQueryParamsService.onQueryParamsChanged().pipe(
      map(params => params.url),
      filter((url: string) => !!url),
      concatMap((url: string) => this.searchQueryParamsService.navigate([url])),
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
