import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { ListSearchFormInDialogModule } from '../../../shared/list-search-form-in-dialog';
import { CreativeBrandCampaignSummaryComponent } from './creative-brand-campaign-summary.component';
import { CreativeBrandInfoViewModule } from '../creative-brand-info-view/creative-brand-info-view.module';
import { CreativeBrandFormButtonModule } from '../creative-brand-form-button/creative-brand-form-button.module';

@NgModule({
  imports: [
    ThemeModule,
    CreativeBrandInfoViewModule,
    CreativeBrandFormButtonModule,
    ListSearchFormInDialogModule,
  ],
  declarations: [
    CreativeBrandCampaignSummaryComponent,
  ],
})
export class CreativeBrandCampaignSummaryModule { }
