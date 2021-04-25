import { DocumentModel } from "@core/api";

export class CreativeProjectMgtSettings {

  document?: DocumentModel;

  selectedDocuments?: DocumentModel[] = [];

  constructor(data: any = {}) {
  }

}
