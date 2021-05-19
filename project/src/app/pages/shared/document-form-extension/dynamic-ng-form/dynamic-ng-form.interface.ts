import { DynamicFormLayout, DynamicFormModel } from '@core/custom';

export class DynamicNGFormSettings {

  formModel: DynamicFormModel = [];

  accordionSettings: { name: string, position?: string, models: DynamicFormModel }[] = [];

  switchTabSettings: { name: string, disabled?: boolean, models: DynamicFormModel, active: boolean }[] = [];

  formMode: 'create' | 'edit' | 'view' = 'create';

  enableLayoutRight: boolean = true;

  formClass: string;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}
