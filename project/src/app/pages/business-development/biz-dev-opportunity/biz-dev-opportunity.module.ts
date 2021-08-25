import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '../../shared';
import { BizDevOpportunityComponent } from './biz-dev-opportunity.component';
import { BizDevFormButtonModule } from '../biz-dev-form-button/biz-dev-form-button.module';
@NgModule({
  imports: [
    ThemeModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    BizDevFormButtonModule,
  ],
  declarations: [
    BizDevOpportunityComponent,
  ],
})
export class BizDevOpportunityModule { }
