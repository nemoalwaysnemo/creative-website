import { GlobalSearchParams } from '@core/api';
import { OptionModel } from '../option-select/option-select.interface';

export class SearchConditionModel {
  readonly placeholder: string;
  readonly type: string;
  readonly visibleFn: (searchParams: GlobalSearchParams) => boolean = (searchParams: GlobalSearchParams) => true;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}

export class SearchDateRangeModel extends SearchConditionModel {
  readonly type: string = 'date-range';
  readonly minKey: string;
  readonly maxKey: string;
}

export class SearchFilterModel extends SearchConditionModel {
  readonly type: string = 'search-filter';
  readonly key: string;
  readonly options?: any[];
  readonly iteration?: boolean = false;
  readonly optionLabels: any = {};
  readonly bufferSize: number = 50;
  readonly filterValueFn: (bucket: any) => boolean = (bucket: any) => true;
  readonly optionModelFn: (agg: any) => any = (agg: any) => ({ label: agg.label, value: (agg.value || agg.key) });

  buildAggOptionModel(agg: any = {}): OptionModel {
    agg.label = this.getOptionLabel(agg);
    return new OptionModel(this.optionModelFn(agg));
  }

  private getOptionLabel(agg: any = {}): string {
    const labels = this.optionLabels;
    const aggKey = labels && (labels[agg.label] || labels[agg.key]) ? (labels[agg.label] || labels[agg.key]) : agg.key;
    return agg.docCount > 0 ? `${aggKey} (${agg.docCount})` : aggKey;
  }

}
