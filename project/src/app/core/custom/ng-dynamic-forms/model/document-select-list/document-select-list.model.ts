import { DynamicFormControlLayout } from '../misc/dynamic-form-control-layout.model';
import { serializable } from '../../decorator/serializable.decorator';
import { DynamicFormValueControlModelConfig, DynamicFormValueControlModel } from '../dynamic-form-value-control.model';
import { DocumentSelectListSettings } from '../../../../../pages/shared/document-form-extension/document-select-list/document-select-list.interface';

export const DYNAMIC_FORM_CONTROL_TYPE_DOCUMENT_SELECT_LIST = 'DOCUMENT_SELECT_LIST';

export interface DynamicDocumentSelectListConfig<T> extends DynamicFormValueControlModelConfig<T> {
}

export class DynamicDocumentSelectListModel<T> extends DynamicFormValueControlModel<T> {
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_DOCUMENT_SELECT_LIST;

  constructor(config: DynamicDocumentSelectListConfig<T>, layout?: DynamicFormControlLayout) {
    super(config, layout);
    this.settings = new DocumentSelectListSettings(config.settings ? Object.assign({}, config.settings, { formMode: config.formMode }) : { formMode: config.formMode });
  }
}
