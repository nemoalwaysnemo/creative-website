
export class SelectableItemSettings {

  selector: string = '.description';

  dataType: string = 'thumbnail-view';

  enableSelectable: boolean = false;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}
