import { Type } from '@angular/core';

export class GlobalDocumentDialogSettings {

  metadata: any = {};

  components: any[];

  containerType: string;

  main?: Type<any>;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }

}
