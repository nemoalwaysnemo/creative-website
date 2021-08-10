import { DynamicFormControlLayout } from '../misc/dynamic-form-control-layout.model';
import { serializable } from '../../decorator/serializable.decorator';
import { DynamicFormValueControlModelConfig, DynamicFormValueControlModel } from '../dynamic-form-value-control.model';
import { DocumentFieldListSettings } from '../../../../../pages/shared/document-form-extension/document-field-list/document-field-list.interface';

export const DYNAMIC_FORM_CONTROL_TYPE_LIST = 'LIST';

export type DynamicListModelConfig<T> = DynamicFormValueControlModelConfig<T>;

export class DynamicListModel<T> extends DynamicFormValueControlModel<T> {
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_LIST;

  constructor(config: DynamicListModelConfig<T>, layout?: DynamicFormControlLayout) {
    super(config, layout);
    this.settings = new DocumentFieldListSettings(config.settings ? Object.assign({}, config.settings, { formMode: config.formMode }) : { formMode: config.formMode });
  }
}
