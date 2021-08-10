import { DynamicFormControlLayout } from '../misc/dynamic-form-control-layout.model';
import { serializable } from '../../decorator/serializable.decorator';
import { DynamicFormValueControlModelConfig, DynamicFormValueControlModel } from '../dynamic-form-value-control.model';
import { BatchUploadSettings } from '../../../../../pages/shared/document-form-extension';

export const DYNAMIC_FORM_CONTROL_TYPE_BATCH_UPLOAD = 'BATCH_UPLOAD';

export type DynamicBatchUploadModelConfig<T> = DynamicFormValueControlModelConfig<T>;

export class DynamicBatchUploadModel<T> extends DynamicFormValueControlModel<T> {
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_BATCH_UPLOAD;

  constructor(config: DynamicBatchUploadModelConfig<T>, layout?: DynamicFormControlLayout) {
    super(config, layout);
    this.settings = new BatchUploadSettings(config.settings ? Object.assign({}, config.settings, { formMode: config.formMode }) : { formMode: config.formMode });
  }
}
