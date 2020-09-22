import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { BackslashEdgeComponent } from './backslash-edge.component';
import { GlobalSearchFormModule, GlobalSearchResultModule, SelectableActionBarModule } from '../../shared/';
import { BackslashTabInfoModule } from '../backslash-tab-info/backslash-tab-info.module';
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
    BackslashTabInfoModule,
  ],
  declarations: [
    BackslashEdgeComponent,
  ],
})
export class BackslashEdgeModule { }
