export class DragDropFileZoneSettings {

  [key: string]: any;

  original: boolean = false;

  multiUpload: boolean = false;

  enableFileList: boolean = false;

  placeholder: string = 'Drop files here';

  acceptTypes: string = '*';

  layout: string = '';

  label: string = '';

  xpath: string;

  formMode: string;

  queueLimit: number = 1;

  maxSize: number = 1024 * 1024 * 1024 * 100; // 1024 = 1mb

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}
