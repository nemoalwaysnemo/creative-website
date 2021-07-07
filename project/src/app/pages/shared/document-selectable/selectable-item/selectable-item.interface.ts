
export class SelectableItemSettings {

  selector: string = '.description';

  dataType: string = 'thumbnail-view';

  enableSelectable: boolean = false;

  queueLimit: number = 100;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}
