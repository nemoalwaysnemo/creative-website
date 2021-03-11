import { DynamicFormControlLayout } from '../misc/dynamic-form-control-layout.model';
import { serializable } from '../../decorator/serializable.decorator';
import { DynamicFormValueControlModelConfig, DynamicFormValueControlModel } from '../dynamic-form-value-control.model';
import { FieldHeaderSettings } from '../../../../../pages/shared/document-form-extension/dynamic-ng-form/field-header/dynamic-ng-field-header.interface';

export const DYNAMIC_FORM_CONTROL_TYPE_FIELD_HEADER = 'FIELD_HEADER';

export interface DynamicFieldHeaderModelConfig<T> extends DynamicFormValueControlModelConfig<T> {
}

export class DynamicFieldHeaderModel<T> extends DynamicFormValueControlModel<T> {
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_FIELD_HEADER;

  constructor(config: DynamicFieldHeaderModelConfig<T>, layout?: DynamicFormControlLayout) {
    super(config, layout);
    this.settings = new FieldHeaderSettings(config.settings ? Object.assign({}, config.settings, { formMode: config.formMode }) : { formMode: config.formMode });
  }
}
