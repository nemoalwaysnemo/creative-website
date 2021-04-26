import { DocumentModel } from '@core/api';

export class CreativeProjectMgtSettings {

  document?: DocumentModel = null;

  selectedDocuments?: DocumentModel[] = [];

  constructor(data: any = {}) {
    Object.assign(this, data);
  }

}
