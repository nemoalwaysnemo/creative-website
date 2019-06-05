import { NgModule, ModuleWithProviders } from '@angular/core';
import { SearchQueryParamsService } from './search-query-params.service';
import { DocumentViewService } from './document-view.service';

const PROVIDERS = [
  SearchQueryParamsService,
  DocumentViewService,
];

@NgModule({
})
export class SharedServiceModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: SharedServiceModule,
      providers: [
        ...PROVIDERS,
      ],
    };
  }
}
