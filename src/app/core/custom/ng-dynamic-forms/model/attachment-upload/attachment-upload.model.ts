import { DynamicFormControlLayout } from '../misc/dynamic-form-control-layout.model';
import { serializable } from '../../decorator/serializable.decorator';
import { DynamicFormValueControlModelConfig, DynamicFormValueControlModel } from '../dynamic-form-value-control.model';

export const DYNAMIC_FORM_CONTROL_TYPE_ATTACHMENT_UPLOAD = 'ATTACHMENT_UPLOAD';

export class DynamicAttachmentUploadModel<T> extends DynamicFormValueControlModel<T> {
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_ATTACHMENT_UPLOAD;

  constructor(config: DynamicFormValueControlModelConfig<T>, layout?: DynamicFormControlLayout) {
    super(config, layout);
  }
}
