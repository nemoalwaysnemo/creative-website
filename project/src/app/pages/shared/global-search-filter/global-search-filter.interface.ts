import { GlobalSearchParams } from '@core/api';
import { OptionModel } from '../option-select/option-select.interface';

export class SearchFilterModel {
  readonly key: string;
  readonly options?: any[];
  readonly placeholder: string;
  readonly iteration?: boolean = false;
  readonly optionLabels: any = {};
  readonly bufferSize: number = 50;
  readonly visibleFn: (searchParams: GlobalSearchParams) => boolean = (searchParams: GlobalSearchParams) => true;
  readonly filterValueFn: (bucket: any) => boolean = (bucket: any) => true;
  readonly optionModelFn: (agg: any) => any = (agg: any) => ({ label: agg.label, value: (agg.value || agg.key) });

  constructor(data: any = {}) {
    Object.assign(this, data);
  }

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
