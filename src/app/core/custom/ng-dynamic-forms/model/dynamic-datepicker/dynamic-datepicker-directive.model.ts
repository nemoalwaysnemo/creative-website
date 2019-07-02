import { DynamicFormControlLayout } from '../misc/dynamic-form-control-layout.model';
import { serializable } from '../../decorator/serializable.decorator';
import { DynamicFormValueControlModelConfig, DynamicFormValueControlModel } from '../dynamic-form-value-control.model';

export const DYNAMIC_FORM_CONTROL_TYPE_DATEPICKER_DIRECTIVE = 'DATEPICKER_DIRECTIVE';

export interface DynamicDatepickerDirectiveModelConfig<T> extends DynamicFormValueControlModelConfig<T> {
  placeholder?: string;
  default?: string | Date;
}

export class DynamicDatepickerDirectiveModel<T> extends DynamicFormValueControlModel<T> {

  @serializable() placeholder: string;
  @serializable() default: string | Date;

  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_DATEPICKER_DIRECTIVE;

  constructor(config: DynamicDatepickerDirectiveModelConfig<T>, layout?: DynamicFormControlLayout) {
    super(config, layout);
    this.placeholder = config.placeholder || '';
    this.default = config.default || null;
  }
}
