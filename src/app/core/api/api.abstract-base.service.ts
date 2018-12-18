import {
  NuxeoApiService,
  NuxeoRequestOptions,
  deepExtend,
} from './nuxeo';

export abstract class AbstractBaseService {

  constructor(protected nuxeoApi: NuxeoApiService) {

  }

  protected getRequestOptions(opts: any = {}): NuxeoRequestOptions {
    return deepExtend(new NuxeoRequestOptions(), opts || {});
  }

}
