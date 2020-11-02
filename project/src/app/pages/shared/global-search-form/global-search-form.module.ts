import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { BaseSearchFormComponent } from './base-search-form.component';
import { GlobalSearchFormComponent } from './global-search-form.component';
import { SharedDirectiveModule } from '../directives/shared-directive.module';
import { GlobalSearchFilterModule } from '../global-search-filter/global-search-filter.module';

@NgModule({
  imports: [
    ThemeModule,
    SharedDirectiveModule,
    GlobalSearchFilterModule,
  ],
  declarations: [
    BaseSearchFormComponent,
    GlobalSearchFormComponent,
  ],
  exports: [
    GlobalSearchFormComponent,
    GlobalSearchFilterModule,
  ],
})
export class GlobalSearchFormModule {
}
