import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdvanceSearch } from '@pages/shared';
import { AggregateModel } from '@core/api';
import { OptionModel } from '@pages/shared/';

@Component({
  selector: 'tbwa-search-filter',
  styleUrls: ['./search-filter.component.scss'],
  templateUrl: './search-filter.component.html',
})
export class SearchFilterComponent implements OnInit, OnDestroy {

  private alive: boolean = true;

  aggregates: {}[] = [];

  constructor(private advanceSearch: AdvanceSearch) {

  }

  ngOnInit() {
    this.getAggregates();
  }

  ngOnDestroy() {
    this.alive = false;
  }

  private getAggregates(): void {
    this.advanceSearch.requestSearchFilters().subscribe((aggregates: AggregateModel[]) => {
      for (const agg of aggregates) {
        this.aggregates[agg.id] = [];
        for (const bucket of agg.extendedBuckets) {
          this.aggregates[agg.id].push(this.newOptionModel(bucket));
        }
      }
    });
  }

  private newOptionModel(agg: any = {}) {
    const label = `${agg.key} (${agg.docCount})`;
    const value = agg.key;
    const disabled = false;
    return new OptionModel(label, value, disabled);
  }

}
