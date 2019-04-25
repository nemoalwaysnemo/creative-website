import { NgModule, ModuleWithProviders } from '@angular/core';
import { GoogleAnalyticsService } from './google-analytics.service';

export const GTM_CONFIG = {

};

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
