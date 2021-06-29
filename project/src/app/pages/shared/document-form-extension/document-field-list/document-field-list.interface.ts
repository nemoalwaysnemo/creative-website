import { DynamicFormModel } from '@core/custom';

export class DocumentFieldListSettings {

  items: DynamicFormModel = [];

  subPathKey: string;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}
