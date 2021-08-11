import { Component, OnDestroy } from '@angular/core';
import { Params } from '@angular/router';
import { DocumentModel, GlobalSearchParams, NuxeoPagination, NuxeoRequestOptions } from '@core/api';
import { isDocumentUID, matchAssetUrl } from '@core/services/helpers';
import { DocumentPageService } from '@pages/shared';
import { Observable, Subscription, of as observableOf } from 'rxjs';
import { concatMap, filter, map } from 'rxjs/operators';

class ParamsInfo {

  [key: string]: any;

  private link: string = '/p/knowledge/home';

  private doc: DocumentModel;

  private urlMapping: any = {
    '*': '/p/knowledge/home',
    'App-Library-Image': '/p/creative/asset/:uid',
    'App-Library-Video': '/p/creative/asset/:uid',
    'App-Library-Audio': '/p/creative/asset/:uid',
    'App-Backslash-Article': '/p/backslash/asset/:uid',
    'App-Backslash-Video': '/p/backslash/asset/:uid',
    'App-Backslash-Case-Study': '/p/backslash/report/folder/:parentRef/asset/:uid',
    'App-Backslash-Edges-Asset': '/p/backslash/resource/edge/:parentRef/asset/:uid',
    'App-Backslash-Resources-Asset': '/p/backslash/resource/folder/:parentRef/asset/:uid',
    'App-Intelligence-Asset': '/p/intelligence/asset/:uid',
    'App-Disruption-Asset': '/p/disruption/asset/:uid',
    'App-Disruption-Day-Asset': '/p/disruption/asset/:uid',
    'App-Disruption-Theory-Asset': '/p/disruption/asset/:uid',
    'App-Disruption-Roadmap-Asset': '/p/disruption/asset/:uid',
    'App-BizDev-CaseStudy-Asset': '/p/business-development/Case Studies/folder/:parentRef/asset/:uid',
    'App-BizDev-Thought-Asset': '/p/business-development/Thought Leadership/folder/:parentRef/asset/:uid',
    'App-Innovation-Asset': (doc: DocumentModel) => {
      let url = '';
      if (doc.path.includes(this.documentPageService.getConfig('path:INNOVATION_BASE_FOLDER_PATH') + 'NEXT')) {
        url = '/p/innovation/NEXT/folder';
      } else if (doc.path.includes(this.documentPageService.getConfig('path:INNOVATION_BASE_FOLDER_PATH') + 'Things to Steal')) {
        url = '/p/innovation/Things to Steal/folder';
      }
      if (doc.type === 'App-Innovation-Asset') {
        url = url + '/:parentRef/asset';
      }
      return url;
    },
  };

  constructor(data: any = {}) {
    Object.assign(this, data);
  }

  get url(): string {
    return this.link;
  }

  set url(url: string) {
    if (url) {
      this.link = url;
    }
  }

  set document(doc: DocumentModel) {
    if (doc) {
      this.link = this.getDocUrl(doc);
      this.doc = doc;
    }
  }

  private getDocUrl(doc: DocumentModel): string {
    const url = matchAssetUrl(doc, this.urlMapping);
    return url || '/p/knowledge/home';
  }
}

@Component({
  selector: 'page-redirection',
  template: '',
})
export class RedirectionComponent implements OnDestroy {

  private subscription: Subscription = new Subscription();

  constructor(private documentPageService: DocumentPageService) {
    this.subscribeEvents();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private subscribeEvents(): void {
    this.subscription = this.documentPageService.onQueryParamsChanged().pipe(
      filter((params: Params) => params.url || isDocumentUID(params.id)),
      concatMap((params: Params) => {
        if (params.url) {
          return observableOf(new ParamsInfo({ url: params.url }));
        } else if (params.id) {
          return this.getDocumentModel(params.id).pipe(
            map((doc: DocumentModel) => new ParamsInfo({ document: doc })),
          );
        } else {
          return observableOf(new ParamsInfo());
        }
      }),
    ).subscribe((info: ParamsInfo) => {
      this.navigateToUrl(info);
    });
  }

  private getDocumentModel(uid: string, params: any = {}, opts?: NuxeoRequestOptions): Observable<DocumentModel> {
    const searchParams = new GlobalSearchParams(Object.assign({}, params, { ecm_uuid: `["${uid}"]` }));
    return this.documentPageService.advanceRequest(searchParams, opts).pipe(
      map((res: NuxeoPagination) => res.entries.shift()),
    );
  }

  private navigateToUrl(info: ParamsInfo): void {
    this.documentPageService.navigate([info.url]);
  }

}
