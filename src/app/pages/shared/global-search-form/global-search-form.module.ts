import { NgModule } from '@angular/core';
import { GlobalSearchFormComponent } from './global-search-form.component';
import { ThemeModule } from '@theme/theme.module';
import { SharedDirectiveModule } from '../directives/shared-directive.module';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { GlobalSearchFilterModule } from '../global-search-filter/global-search-filter.module';

@NgModule({
  imports: [
    ThemeModule,
    SharedDirectiveModule,
    GlobalSearchFilterModule,
  ],
  providers: [
    SearchQueryParamsService,
  ],
  declarations: [
    GlobalSearchFormComponent,
  ],
  exports: [
    GlobalSearchFormComponent,
    GlobalSearchFilterModule,
  ],
})
export class GlobalSearchFormModule {
}
