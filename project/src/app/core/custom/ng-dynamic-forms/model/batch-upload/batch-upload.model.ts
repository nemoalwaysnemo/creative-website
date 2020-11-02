import { DynamicFormControlLayout } from '../misc/dynamic-form-control-layout.model';
import { serializable } from '../../decorator/serializable.decorator';
import { DynamicFormValueControlModelConfig, DynamicFormValueControlModel } from '../dynamic-form-value-control.model';
import { isBoolean } from '../../utils/core.utils';

export const DYNAMIC_FORM_CONTROL_TYPE_BATCH_UPLOAD = 'BATCH_UPLOAD';

export interface DynamicBatchUploadModelConfig<T> extends DynamicFormValueControlModelConfig<T> {
  multiUpload?: boolean;
  showInputs?: boolean;
}

export class DynamicBatchUploadModel<T> extends DynamicFormValueControlModel<T> {
  @serializable() multiUpload: boolean;
  @serializable() showInputs: boolean;
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_BATCH_UPLOAD;

  constructor(config: DynamicBatchUploadModelConfig<T>, layout?: DynamicFormControlLayout) {
    super(config, layout);
    this.multiUpload = config.multiUpload;
    this.showInputs = isBoolean(config.showInputs) ? config.showInputs : true;
  }
}
