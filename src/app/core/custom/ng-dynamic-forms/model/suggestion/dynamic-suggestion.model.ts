import { DynamicFormControlLayout } from '../misc/dynamic-form-control-layout.model';
import { serializable } from '../../decorator/serializable.decorator';
import { isFunction } from '../../utils/core.utils';
import { Observable, of as observableOf } from 'rxjs';
import { DynamicFormValueControlModelConfig, DynamicFormValueControlModel } from '../dynamic-form-value-control.model';
import { SuggestionSettings } from '../../../../../pages/shared/directory-suggestion/directory-suggestion-settings';

export const DYNAMIC_FORM_CONTROL_TYPE_SUGGESTION = 'SUGGESTION';

export interface DynamicSuggestionModelConfig<T> extends DynamicFormValueControlModelConfig<T> {
  settings: any;
  afterSearch?: Function;
  onResponsed?: Function;
}

export class DynamicSuggestionModel<T> extends DynamicFormValueControlModel<T> {
  @serializable() settings: any;
  @serializable() afterSearch: Function;
  @serializable() onResponsed: Function;
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_SUGGESTION;

  constructor(config: DynamicSuggestionModelConfig<T>, layout?: DynamicFormControlLayout) {
    super(config, layout);
    this.settings = new SuggestionSettings(config.settings || {});
    this.defaultValue = this.settings.multiple ? [] : null;
    this.afterSearch = isFunction(config.afterSearch) ? config.afterSearch : (options: any[]): Observable<any[]> => observableOf(options);
    this.onResponsed = isFunction(config.onResponsed) ? config.onResponsed : (res: any): any => res;
  }
}
