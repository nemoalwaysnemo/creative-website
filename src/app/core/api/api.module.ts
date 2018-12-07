import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NuxeoModule } from './nuxeo';
import { Environment } from '@environment/environment';

const SERVICES = [
  ...NuxeoModule.forRoot({
    baseUrl: Environment.nuxeoUrl,
    production: Environment.production,
    appName: Environment.appName,
  }).providers,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    ...SERVICES,
  ],
})
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
