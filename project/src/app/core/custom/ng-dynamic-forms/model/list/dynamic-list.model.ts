import { DynamicFormControlLayout } from '../misc/dynamic-form-control-layout.model';
import { serializable } from '../../decorator/serializable.decorator';
import { DynamicFormValueControlModelConfig, DynamicFormValueControlModel } from '../dynamic-form-value-control.model';
import { DynamicFormModel } from '../dynamic-form.model';

export const DYNAMIC_FORM_CONTROL_TYPE_LIST = 'LIST';

export interface DynamicListModelConfig<T> extends DynamicFormValueControlModelConfig<T> {
  items: DynamicFormModel;
}

export class DynamicListModel<T> extends DynamicFormValueControlModel<T> {
  @serializable() items: DynamicFormModel = [];
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_LIST;

  constructor(config: DynamicListModelConfig<T>, layout?: DynamicFormControlLayout) {
    super(config, layout);
    this.items = config.items || [];
  }
}
