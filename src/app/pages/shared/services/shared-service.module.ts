import { NgModule, ModuleWithProviders } from '@angular/core';
import { SearchQueryParamsService } from './search-query-params.service';

const PROVIDERS = [
  SearchQueryParamsService,
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
