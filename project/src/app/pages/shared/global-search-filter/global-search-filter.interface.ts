import { GlobalSearchParams } from '@core/api';
import { OptionModel } from '../option-select/option-select.interface';

export class SearchFilterModel {
  readonly key: string;
  readonly options?: any[];
  readonly placeholder: string;
  readonly iteration?: boolean = false;
  readonly optionLabels?: any = {};
  readonly bufferSize?: number = 50;
  readonly visibleFn: (searchParams: GlobalSearchParams) => boolean = () => true;
  readonly filterValueFn: (bucket: any) => boolean = () => true;
  readonly lableFormatFn: (bucket: any) => boolean = () => true;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }

}
