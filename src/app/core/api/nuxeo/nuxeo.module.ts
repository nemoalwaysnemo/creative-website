import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NUXEO_ENV, NuxeoOptions } from './nuxeo.options';
import { NuxeoApiService } from './nuxeo.api.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  declarations: [],
})
export class NuxeoModule {
  static forRoot(env: NuxeoOptions): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: NuxeoModule,
      providers: [
        NuxeoApiService,
        { provide: NUXEO_ENV, useValue: env },
      ],
    };
  }
}
