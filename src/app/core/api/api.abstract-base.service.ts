import {
  NuxeoApiService,
  NuxeoRequestOptions,
  deepExtend,
  NuxeoPageProviderParams,
  NuxeoPagination,
  AggregateModel,
} from './nuxeo';

export abstract class AbstractBaseService {

  constructor(protected nuxeoApi: NuxeoApiService) {
  }

  protected getRequestParams(opts: any = {}): NuxeoPageProviderParams {
    return deepExtend(new NuxeoPageProviderParams(), opts || {}, (opts.ecm_fulltext ? { ecm_fulltext: `${opts.ecm_fulltext}*` } : {}));
  }

  protected getRequestOptions(opts: any = {}): NuxeoRequestOptions {
    return deepExtend(new NuxeoRequestOptions(), opts || {});
  }

  public buildAggregateModels(response: NuxeoPagination): AggregateModel[] {
    const aggregations: AggregateModel[] = [];
    const aggs = Object.values(response.aggregations);
    for (const agg of aggs) {
      aggregations.push(new AggregateModel(agg));
    }
    return aggregations;
  }


}
