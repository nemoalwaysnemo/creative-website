import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '../../shared';
import { InnovationFormButtonModule } from '../innovation-form-button/innovation-form-button.module';
import { InnovationListComponent } from './innovation-list.component';

@NgModule({
  imports: [
    ThemeModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    InnovationFormButtonModule,
  ],
  declarations: [
    InnovationListComponent,
  ],
})
export class InnovationListModule { }
