import { deepExtend } from '../services';
import {
  NuxeoApiService,
  NuxeoRequestOptions,
  NuxeoPageProviderParams,
} from './nuxeo';

export abstract class AbstractBaseSearchService {

  protected defaultParams: NuxeoPageProviderParams = new NuxeoPageProviderParams();

  constructor(protected nuxeoApi: NuxeoApiService) {
  }

  protected getRequestParams(opts: any = {}): NuxeoPageProviderParams {
    const options = opts || {};
    const searchTerm: any = {};
    if (options.hasOwnProperty('ecm_fulltext')) {
      if (options.ecm_fulltext) {
        searchTerm.ecm_fulltext = `${opts.ecm_fulltext}*`;
      } else {
        delete options.ecm_fulltext;
      }
    }
    return deepExtend(new NuxeoPageProviderParams(), this.defaultParams, options, searchTerm);
  }

  protected getRequestOptions(opts: any = {}): NuxeoRequestOptions {
    return deepExtend(new NuxeoRequestOptions(), opts || {});
  }

}
