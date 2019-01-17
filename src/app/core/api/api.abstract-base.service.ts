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
    const options = opts || {};
    if (options.hasOwnProperty('ecm_fulltext')) {
      if (options.ecm_fulltext) {
        options.ecm_fulltext = `${opts.ecm_fulltext}*`;
      } else {
        delete options.ecm_fulltext;
      }
    }
    return deepExtend(new NuxeoPageProviderParams(), this.defaultParams, options);
  }

  protected getRequestOptions(opts: any = {}): NuxeoRequestOptions {
    return deepExtend(new NuxeoRequestOptions(), opts || {});
  }

}
