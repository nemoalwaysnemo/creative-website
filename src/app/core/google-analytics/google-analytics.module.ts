import { NgModule, ModuleWithProviders } from '@angular/core';
import { GoogleAnalyticsService } from './google-analytics.service';

@NgModule({
})
export class GoogleAnalyticsModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: GoogleAnalyticsModule,
      providers: [
        GoogleAnalyticsService,
      ],
    };
  }
}
