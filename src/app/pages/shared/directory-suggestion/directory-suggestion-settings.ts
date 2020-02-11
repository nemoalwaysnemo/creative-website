import { DocumentModel } from '../../../core/api/nuxeo/lib';

export class SuggestionSettings {
  static readonly PROVIDER: string = 'PageProvider'; // document page-provider
  static readonly DIRECTORY: string = 'Directory'; // vocabulary
  static readonly OPERATION: string = 'Operation'; // operation
  static readonly CONTENT_VIEW: string = 'ContentViewProvider'; // content view page-provider
  static readonly USER_GROUP: string = 'UserGroup'; // content view page-provider

  readonly placeholder: string = 'Please select value';
  readonly contains: boolean = true;
  readonly suggestion: boolean = true;
  readonly initSearch: boolean = true;
  readonly multiple: boolean = false;
  readonly providerType: string;
  readonly providerName: string;
  readonly pageSize: number = 20;
  readonly inputTarget: Function = (doc: DocumentModel): string => doc.getParent().uid;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}
