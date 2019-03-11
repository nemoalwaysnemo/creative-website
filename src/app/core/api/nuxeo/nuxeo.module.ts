import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NUXEO_ENV, NuxeoApiOptions } from './nuxeo.options';
import { NuxeoApiService } from './nuxeo.api.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
  ],
})
export class NuxeoModule {
  static forRoot(env: NuxeoApiOptions): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: NuxeoModule,
      providers: [
        NuxeoApiService,
        { provide: NUXEO_ENV, useValue: env },
      ],
    };
  }
}
