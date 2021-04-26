import { DocumentModel } from '@core/api';

export class CreativeProjectMgtSettings {

  [key: string]: any;

  document?: DocumentModel = null;

  selectedDocuments?: DocumentModel[] = [];

  constructor(data: any = {}) {
    Object.assign(this, data);
  }

}
