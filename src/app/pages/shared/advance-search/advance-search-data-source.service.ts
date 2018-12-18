import { Injectable } from '@angular/core';
import { NuxeoApiService, AbstractPageProvider, NuxeoRequestParams, NuxeoPagination, AggregateModel } from '@core/api';
import { NUXEO_META_INFO } from '@environment/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { deepExtend } from '@core/services';

@Injectable()
export class AdvanceSearchDataSource extends AbstractPageProvider {

  private defaultParams: NuxeoRequestParams;

  constructor(protected nuxeoApi: NuxeoApiService) {
    super(nuxeoApi);
    this.defaultParams = new NuxeoRequestParams();
    this.defaultParams.ecm_path = NUXEO_META_INFO.BASE_FOLDER_PATH;
  }

  protected getRequestParams(opts: any = {}): NuxeoRequestParams {
    return deepExtend({}, this.defaultParams, opts);
  }

  requestSearchFilters(): Observable<AggregateModel[]> {
    return this.request(this.getRequestParams({ pageSize: 1 })).pipe(
      map((res: NuxeoPagination) => {
        const aggregations: AggregateModel[] = [];
        const aggs = Object.values(res.aggregations);
        for (const agg of aggs) {
          aggregations.push(new AggregateModel(agg));
        }
        return aggregations;
      }),
    );
  }

  searchForText(param: string): Observable<NuxeoPagination> {
    const text: string = '*' + param;
    return this.request(this.getRequestParams({ ecm_fulltext: text, pageSize: 10 }));
  }
}
