import { DynamicFormLayout, DynamicFormModel } from '@core/custom';

export class DynamicNGFormSettings {

  formModel: DynamicFormModel = [];

  formLayout: DynamicFormLayout = {};

  accordionSettings: { name: string, position: string, models: DynamicFormModel }[] = [];

  switchTabSettings: any[] = [];

  enableLayoutRight: boolean = true;

  formClass: string;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}
