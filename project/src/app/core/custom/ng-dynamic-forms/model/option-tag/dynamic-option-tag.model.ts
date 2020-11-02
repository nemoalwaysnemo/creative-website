import { DynamicFormControlLayout } from '../misc/dynamic-form-control-layout.model';
import { serializable } from '../../decorator/serializable.decorator';
import { isBoolean } from '../../utils/core.utils';
import { DynamicFormValueControlModelConfig, DynamicFormValueControlModel } from '../dynamic-form-value-control.model';

export const DYNAMIC_FORM_CONTROL_TYPE_OPTION_TAG = 'OPTION_TAG';

export interface DynamicOptionTagModelConfig<T> extends DynamicFormValueControlModelConfig<T> {
  placeholder?: string;
}

export class DynamicOptionTagModel<T> extends DynamicFormValueControlModel<T> {

  @serializable() placeholder: string;
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_OPTION_TAG;

  constructor(config: DynamicOptionTagModelConfig<T>, layout?: DynamicFormControlLayout) {
    super(config, layout);
    this.placeholder = config.placeholder || '';
  }
}
