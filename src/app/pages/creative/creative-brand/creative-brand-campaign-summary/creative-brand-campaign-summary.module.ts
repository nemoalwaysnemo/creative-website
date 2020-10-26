import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { ListSearchFormModule } from '../../../shared/list-search-form';
import { CreativeBrandCampaignSummaryComponent } from './creative-brand-campaign-summary.component';
import { CreativeBrandInfoViewModule } from '../creative-brand-info-view/creative-brand-info-view.module';
import { CreativeBrandFormButtonModule } from '../creative-brand-form-button/creative-brand-form-button.module';

@NgModule({
  imports: [
    ThemeModule,
    ListSearchFormModule,
    CreativeBrandInfoViewModule,
    CreativeBrandFormButtonModule,
  ],
  declarations: [
    CreativeBrandCampaignSummaryComponent,
  ],
})
export class CreativeBrandCampaignSummaryModule { }
