import { NgModule, ModuleWithProviders } from '@angular/core';
import { BasePageProvider } from './api.page-provider.service';
import { NuxeoModule } from './nuxeo';
import { Environment } from '@environment/environment';

const SERVICES = [
  ...NuxeoModule.forRoot({
    baseUrl: Environment.nuxeoUrl,
    production: Environment.production,
    appName: Environment.appName,
  }).providers,
  BasePageProvider,
];

@NgModule()
export class APIModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: APIModule,
      providers: [
        ...SERVICES,
      ],
    };
  }
}
