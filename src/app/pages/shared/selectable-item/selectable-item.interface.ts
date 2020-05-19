
export class SelectableItemSettings {

  selector: string;

  dataType: string = 'default';

  enableCheckBox: boolean = true;

  enableSelectable: boolean = false;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}
