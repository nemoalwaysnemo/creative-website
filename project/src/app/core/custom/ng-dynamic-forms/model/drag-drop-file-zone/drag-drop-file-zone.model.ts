import { DynamicFormControlLayout } from '../misc/dynamic-form-control-layout.model';
import { serializable } from '../../decorator/serializable.decorator';
import { DynamicFormValueControlModelConfig, DynamicFormValueControlModel } from '../dynamic-form-value-control.model';
import { DragDropFileZoneSettings } from '../../../../../pages/shared/document-form-extension/drag-drop-file-zone/drag-drop-file-zone.interface';

export const DYNAMIC_FORM_CONTROL_TYPE_DRAG_GROP_FILE_ZONE = 'DRAG_GROP_FILE_ZONE';

export interface DynamicDragDropFileZoneConfig<T> extends DynamicFormValueControlModelConfig<T> {
}

export class DynamicDragDropFileZoneModel<T> extends DynamicFormValueControlModel<T> {
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_DRAG_GROP_FILE_ZONE;

  constructor(config: DynamicDragDropFileZoneConfig<T>, layout?: DynamicFormControlLayout) {
    super(config, layout);
    config.settings.xpath = config.settings.xpath ? config.settings.xpath : (config.field || config.id);
    this.settings = new DragDropFileZoneSettings(config.settings ? Object.assign({}, config.settings, { formMode: config.formMode }) : { formMode: config.formMode });
  }
}
