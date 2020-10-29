import { DynamicFormControlLayout } from '../misc/dynamic-form-control-layout.model';
import { serializable } from '../../decorator/serializable.decorator';
import { DynamicFormValueControlModelConfig, DynamicFormValueControlModel } from '../dynamic-form-value-control.model';
import { GalleryUploadSettings } from '../../../../../pages/shared/document-form-extension';

export const DYNAMIC_FORM_CONTROL_TYPE_PICTURE_GALLERY_UPLOAD = 'PICTURE_GALLERY_UPLOAD';

export interface DynamicGalleryUploadModelConfig<T> extends DynamicFormValueControlModelConfig<T> {
  settings: any;
}

export class DynamicGalleryUploadModel<T> extends DynamicFormValueControlModel<T> {
  @serializable() settings: any;
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_PICTURE_GALLERY_UPLOAD;

  constructor(config: DynamicGalleryUploadModelConfig<T>, layout?: DynamicFormControlLayout) {
    super(config, layout);
    this.settings = new GalleryUploadSettings(config.settings || {});
  }
}
