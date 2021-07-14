import { DynamicFormControlLayout } from '../misc/dynamic-form-control-layout.model';
import { serializable } from '../../decorator/serializable.decorator';
import { isFunction } from '../../utils/core.utils';
import { Observable, of as observableOf } from 'rxjs';
import { DynamicFormValueControlModelConfig, DynamicFormValueControlModel } from '../dynamic-form-value-control.model';
import { SuggestionSettings } from '../../../../../pages/shared/document-form-extension';

export const DYNAMIC_FORM_CONTROL_TYPE_SUGGESTION = 'SUGGESTION';

export interface DynamicSuggestionModelConfig<T> extends DynamicFormValueControlModelConfig<T> {
  settings: any;
  afterSearch?: () => void;
  onResponse?: (res: any) => void;
}

export class DynamicSuggestionModel<T> extends DynamicFormValueControlModel<T> {
  @serializable() settings: any;
  @serializable() afterSearch: (options: any[]) => void;
  @serializable() onResponse: (res: any) => void;
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_SUGGESTION;

  constructor(config: DynamicSuggestionModelConfig<T>, layout?: DynamicFormControlLayout) {
    super(config, layout);
    this.settings = new SuggestionSettings(config.settings ? Object.assign({}, config.settings, { formMode: config.formMode }) : { formMode: config.formMode });
    this.defaultValue = this.settings.multiple ? [] : null;
    this.defaultValue = config.defaultValue ? config.defaultValue : this.defaultValue;
    this.afterSearch = isFunction(config.afterSearch) ? config.afterSearch : (options: any[]): Observable<any[]> => observableOf(options);
    this.onResponse = isFunction(config.onResponse) ? config.onResponse : (res: any): any => res;
  }
}
