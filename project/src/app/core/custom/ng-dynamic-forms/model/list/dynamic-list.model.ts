import { DynamicFormControlLayout } from '../misc/dynamic-form-control-layout.model';
import { serializable } from '../../decorator/serializable.decorator';
import { DynamicFormValueControlModelConfig, DynamicFormValueControlModel } from '../dynamic-form-value-control.model';
import { DocumentFormListSettings } from '../../../../../pages/shared/document-form-extension/document-form-list/document-form-list.interface';

export const DYNAMIC_FORM_CONTROL_TYPE_LIST = 'LIST';

export interface DynamicListModelConfig<T> extends DynamicFormValueControlModelConfig<T> {
}

export class DynamicListModel<T> extends DynamicFormValueControlModel<T> {
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_LIST;

  constructor(config: DynamicListModelConfig<T>, layout?: DynamicFormControlLayout) {
    super(config, layout);
    this.settings = new DocumentFormListSettings(config.settings ? Object.assign({}, config.settings, { formMode: config.formMode }) : { formMode: config.formMode });
  }
}
