import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { BackslashEdgeComponent } from './backslash-edge.component';
import { DocumentRouteTabsetModule, GlobalSearchFormModule, GlobalSearchResultModule, SelectableActionBarModule } from '../../shared/';
import { BackslashFormButtonModule } from '../backslash-form-button/backslash-form-button.module';
import { GlobalSearchButtonModule } from '../../shared/global-search-button/global-search-button.module';

@NgModule({
  imports: [
    ThemeModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    GlobalSearchButtonModule,
    BackslashFormButtonModule,
    SelectableActionBarModule,
    DocumentRouteTabsetModule,
  ],
  declarations: [
    BackslashEdgeComponent,
  ],
})
export class BackslashEdgeModule { }
