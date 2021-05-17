import { DynamicFormModel } from '@core/custom';

export class DocumentFormListSettings {

  items: DynamicFormModel = [];

  subPathKey: string;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}
