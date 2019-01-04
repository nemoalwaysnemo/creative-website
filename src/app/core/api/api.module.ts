import { NgModule, ModuleWithProviders } from '@angular/core';
import { DocumentRepository } from './api.document-repository.service';
import { AdvanceSearch } from './api.advance-search.service';
import { UserService } from './api.user.service';
import { NuxeoModule } from './nuxeo';
import { Environment } from '@environment/environment';


const SERVICES = [
  ...NuxeoModule.forRoot({
    baseUrl: Environment.nuxeoUrl,
    production: Environment.production,
    appName: Environment.appName,
  }).providers,
  DocumentRepository,
  AdvanceSearch,
  UserService,
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
