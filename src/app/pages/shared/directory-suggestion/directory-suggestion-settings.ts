import { DocumentModel } from '../../../core/api/nuxeo/lib';

export class SuggestionSettings {
  static readonly PROVIDER: string = 'PageProvider'; // document page-provider
  static readonly DIRECTORY: string = 'Directory'; // vocabulary
  static readonly OPERATION: string = 'Operation'; // operation
  static readonly CONTENT_VIEW: string = 'ContentViewProvider'; // content view page-provider
  static readonly USER_GROUP: string = 'UserGroup'; // content view page-provider
  static readonly TAG: string = 'Tag'; // nuxeo tag

  readonly viewType: 'suggestion' | 'list' = 'suggestion';
  readonly placeholder: string = 'Please select value';
  readonly prompt: string = 'Search';
  readonly addTag: boolean | ((name: string) => any);
  readonly contains: boolean = true;
  readonly filterParent: boolean = true;
  readonly initSearch: boolean = true;
  readonly multiple: boolean = true;
  readonly parentOnly: boolean = false;
  readonly providerType: string;
  readonly providerName: string;
  readonly pageSize: number = 20;
  readonly displayLabel: boolean = false;
  readonly inputTarget: (doc: DocumentModel) => string = (doc: DocumentModel) => doc.getParent().uid;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}
