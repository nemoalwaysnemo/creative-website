import { DynamicFormControlLayout } from '../misc/dynamic-form-control-layout.model';
import { serializable } from '../../decorator/serializable.decorator';
import { isBoolean } from '../../utils/core.utils';
import { DynamicFormValueControlModelConfig, DynamicFormValueControlModel } from '../dynamic-form-value-control.model';

export const DYNAMIC_FORM_CONTROL_TYPE_SUGGESTION = 'SUGGESTION';

export interface DynamicSuggestionModelConfig<T> extends DynamicFormValueControlModelConfig<T> {

  placeholder?: string;
  directoryName?: string;
  searchUserGroup?: boolean
  contains?: boolean
  suggestion?: boolean;
  initSearch?: boolean;
  providerName?: string;
  multiple?: boolean;
}

export class DynamicSuggestionModel<T> extends DynamicFormValueControlModel<T> {

  @serializable() placeholder: string;
  @serializable() directoryName: string;
  @serializable() providerName: string;
  @serializable() searchUserGroup: boolean;
  @serializable() suggestion: boolean;
  @serializable() initSearch: boolean;
  @serializable() contains: boolean;
  @serializable() multiple: boolean;

  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_SUGGESTION;

  constructor(config: DynamicSuggestionModelConfig<T>, layout?: DynamicFormControlLayout) {
    super(config, layout);
    this.suggestion = isBoolean(config.suggestion) ? config.suggestion : true;
    this.initSearch = isBoolean(config.initSearch) ? config.initSearch : true;
    this.contains = isBoolean(config.contains) ? config.contains : true;
    this.searchUserGroup = isBoolean(config.searchUserGroup) ? config.searchUserGroup : true;
    this.directoryName = config.directoryName || null;
    this.providerName = config.providerName || null;
    this.placeholder = config.placeholder || '';
    this.multiple = isBoolean(config.multiple) ? config.multiple : true;
  }
}
