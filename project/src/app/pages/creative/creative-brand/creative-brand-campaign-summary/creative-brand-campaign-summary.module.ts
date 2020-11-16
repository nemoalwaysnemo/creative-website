import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { ListSearchFormModule } from '../../../shared/list-search-form';
import { ListSearchFormForUrModule } from '../../../shared/list-search-form-for-ur';
import { CreativeBrandCampaignSummaryComponent } from './creative-brand-campaign-summary.component';
import { CreativeBrandInfoViewModule } from '../creative-brand-info-view/creative-brand-info-view.module';
import { CreativeBrandFormButtonModule } from '../creative-brand-form-button/creative-brand-form-button.module';

@NgModule({
  imports: [
    ThemeModule,
    ListSearchFormModule,
    ListSearchFormForUrModule,
    CreativeBrandInfoViewModule,
    CreativeBrandFormButtonModule,
  ],
  declarations: [
    CreativeBrandCampaignSummaryComponent,
  ],
})
export class CreativeBrandCampaignSummaryModule { }
