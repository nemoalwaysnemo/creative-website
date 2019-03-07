import { DynamicFormControlLayout } from '../misc/dynamic-form-control-layout.model';
import { serializable } from '../../decorator/serializable.decorator';
import { DynamicFormValueControlModelConfig, DynamicFormValueControlModel } from '../dynamic-form-value-control.model';

export const DYNAMIC_FORM_CONTROL_TYPE_BATCH_UPLOAD = 'BATCH_UPLOAD';

export interface DynamicBatchUploadModelConfig<T> extends DynamicFormValueControlModelConfig<T> {

  placeholder?: string;
  acceptTypes?: string
  maxSize?: number;
}

export class DynamicBatchUploadModel<T> extends DynamicFormValueControlModel<T> {

  @serializable() placeholder: string;
  @serializable() acceptTypes: string;
  @serializable() maxSize: number;
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_BATCH_UPLOAD;

  constructor(config: DynamicBatchUploadModelConfig<T>, layout?: DynamicFormControlLayout) {
    super(config, layout);
    this.placeholder = config.placeholder || 'Drop files here';
    this.acceptTypes = config.acceptTypes || '*';
    this.maxSize = config.maxSize || 1048576 * 10; // 1024 == 1mb
  }
}
