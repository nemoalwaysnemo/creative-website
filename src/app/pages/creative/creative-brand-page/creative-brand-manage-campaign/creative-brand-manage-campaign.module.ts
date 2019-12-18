import { NgModule } from '@angular/core';
import { SharedModule } from '@pages/shared/shared.module';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { ThemeModule } from '@theme/theme.module';
import { CreativeBrandInfoViewModule } from '../creative-brand-info-view/creative-brand-info-view.module';
import { CreativeBrandManageCampaignComponent } from './creative-brand-manage-campaign.component';
import { GlobalSearchButtonModule } from '../creative-brand-form-button/creative-brand-form-button.module';


@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    GlobalSearchButtonModule,
    CreativeBrandInfoViewModule,
    GlobalSearchFormModule,
  ],
  declarations: [
    CreativeBrandManageCampaignComponent,
  ],
  providers: [
  ],
})
export class CreativeBrandManageCampaignModule { }
