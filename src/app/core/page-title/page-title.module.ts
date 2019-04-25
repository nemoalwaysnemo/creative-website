import { NgModule, ModuleWithProviders } from '@angular/core';
import { PageTitleService } from './page-title.service';

@NgModule({
})
export class PageTitleModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: PageTitleModule,
      providers: [
        PageTitleService,
      ],
    };
  }
}
