import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { ListSearchFormCustomViewModule } from '../../../shared/list-search-form-custom-view';
import { CreativeBrandCampaignSummaryComponent } from './creative-brand-campaign-summary.component';
import { CreativeBrandInfoViewModule } from '../creative-brand-info-view/creative-brand-info-view.module';
import { CreativeBrandFormButtonModule } from '../creative-brand-form-button/creative-brand-form-button.module';

@NgModule({
  imports: [
    ThemeModule,
    CreativeBrandInfoViewModule,
    CreativeBrandFormButtonModule,
    ListSearchFormCustomViewModule,
  ],
  declarations: [
    CreativeBrandCampaignSummaryComponent,
  ],
})
export class CreativeBrandCampaignSummaryModule { }
