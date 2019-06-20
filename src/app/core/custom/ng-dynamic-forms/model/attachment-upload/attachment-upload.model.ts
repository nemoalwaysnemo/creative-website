import { DynamicFormControlLayout } from '../misc/dynamic-form-control-layout.model';
import { serializable } from '../../decorator/serializable.decorator';
import { DynamicFormValueControlModelConfig, DynamicFormValueControlModel } from '../dynamic-form-value-control.model';

export const DYNAMIC_FORM_CONTROL_TYPE_ATTACHMENT_UPLOAD = 'ATTACHMENT_UPLOAD';

export interface DynamicAttachmentUploadModelConfig<T> extends DynamicFormValueControlModelConfig<T> {

  placeholder?: string;
  acceptTypes?: string;
  queueLimit?: number;
  maxSize?: number;
}

export class DynamicAttachmentUploadModel<T> extends DynamicFormValueControlModel<T> {

  @serializable() placeholder: string;
  @serializable() acceptTypes: string;
  @serializable() queueLimit: number;
  @serializable() maxSize: number;
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_ATTACHMENT_UPLOAD;

  constructor(config: DynamicAttachmentUploadModelConfig<T>, layout?: DynamicFormControlLayout) {
    super(config, layout);
    this.placeholder = config.placeholder || 'Drop files here';
    this.acceptTypes = config.acceptTypes || '*';
    this.queueLimit = config.queueLimit || 5;
    this.maxSize = config.maxSize || 1048576 * 200; // 1024 == 1mb
  }
}
