import { deepExtend } from '../services';
import {
  NuxeoApiService,
  NuxeoRequestOptions,
  NuxeoPageProviderParams,
} from './nuxeo';

export abstract class AbstractBaseService {

  protected defaultParams: NuxeoPageProviderParams = new NuxeoPageProviderParams();

  constructor(protected nuxeoApi: NuxeoApiService) {
  }

  protected getRequestParams(opts: any = {}): NuxeoPageProviderParams {
    return deepExtend(new NuxeoPageProviderParams(), this.defaultParams, opts || {}, (opts.ecm_fulltext ? { ecm_fulltext: `${opts.ecm_fulltext}*` } : {}));
  }

  protected getRequestOptions(opts: any = {}): NuxeoRequestOptions {
    return deepExtend(new NuxeoRequestOptions(), opts || {});
  }

}
