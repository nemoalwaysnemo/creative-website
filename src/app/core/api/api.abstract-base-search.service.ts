import { deepExtend } from '../services/helpers';
import { NuxeoApiService, NuxeoRequestOptions, NuxeoPageProviderParams } from './nuxeo';
import { NUXEO_PATH_INFO } from '@environment/environment';

export abstract class AbstractBaseSearchService {

  protected defaultParams: NuxeoPageProviderParams = new NuxeoPageProviderParams();

  constructor(protected nuxeoApi: NuxeoApiService) {
  }

  protected getRequestParams(opts: any = {}): NuxeoPageProviderParams {
    const options = opts || {};
    const searchTerm: any = {};
    if (options.hasOwnProperty('ecm_fulltext')) {
      if (options.ecm_fulltext) {
        searchTerm.ecm_fulltext = `${opts.ecm_fulltext}`;
      } else {
        delete options.ecm_fulltext;
      }
    }
    if (!options.hasOwnProperty('ecm_path') && !options.hasOwnProperty('ecm_path_eq')) {
      searchTerm.ecm_path = NUXEO_PATH_INFO.CREATIVE_BASE_FOLDER_PATH;
    } else if (options.hasOwnProperty('ecm_path_eq')) {
      options.ecm_path_eq = '/' + options.ecm_path_eq.split('/').filter((x: string) => x.trim()).join('/');
    }
    const searchParams: NuxeoPageProviderParams = deepExtend(new NuxeoPageProviderParams(), this.defaultParams, options, searchTerm);
    if (searchParams.hasOwnProperty('ecm_mixinType') || !searchParams['ecm_mixinType_not_in']) {
      delete searchParams.ecm_mixinType_not_in;
    }
    return searchParams;
  }

  protected getRequestOptions(opts: any = {}): NuxeoRequestOptions {
    return deepExtend(new NuxeoRequestOptions(), opts || {});
  }

}
