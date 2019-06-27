import { DynamicFormControlLayout } from '../misc/dynamic-form-control-layout.model';
import { serializable } from '../../decorator/serializable.decorator';
import { DynamicFormValueControlModelConfig, DynamicFormValueControlModel } from '../dynamic-form-value-control.model';

export const DYNAMIC_FORM_CONTROL_TYPE_DRAG_GROP_FILE_ZONE = 'DRAG_GROP_FILE_ZONE';

export interface DynamicDragDropFileZoneConfig<T> extends DynamicFormValueControlModelConfig<T> {
  uploadType: 'asset' | 'attachment';
  placeholder?: string;
  acceptTypes?: string;
  queueLimit?: number;
  maxSize?: number;
}

export class DynamicDragDropFileZoneModel<T> extends DynamicFormValueControlModel<T> {
  @serializable() placeholder: string;
  @serializable() acceptTypes: string;
  @serializable() queueLimit: number;
  @serializable() maxSize: number;
  @serializable() uploadType: string;
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_DRAG_GROP_FILE_ZONE;

  constructor(config: DynamicDragDropFileZoneConfig<T>, layout?: DynamicFormControlLayout) {
    super(config, layout);
    this.placeholder = config.placeholder || 'Drop to upload asset';
    this.acceptTypes = config.acceptTypes || '*';
    this.queueLimit = config.queueLimit || 5;
    this.uploadType = config.uploadType;
    this.maxSize = config.maxSize || 1048576 * 200; // 1024 == 1mb
  }
}
