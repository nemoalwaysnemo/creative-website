import { DynamicFormLayout, DynamicFormModel } from '@core/custom';

export class DynamicNGFormSettings {

  formModel: DynamicFormModel = [];

  formLayout: DynamicFormLayout = {};

  accordionSettings: { name: string, position?: string, models: DynamicFormModel }[] = [];

  switchTabSettings: { name: string, disabled?: boolean, models: DynamicFormModel }[] = [];

  formMode: 'create' | 'edit' | 'view' = 'create';

  enableLayoutRight: boolean = true;

  formClass: string;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}
