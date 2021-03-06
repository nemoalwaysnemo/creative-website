import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { ListSearchFormModule } from '../../../shared/list-search-form';
import { CreativeBrandCampaignProjectMgtComponent } from './creative-brand-campaign-project-mgt.component';
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
    CreativeBrandCampaignProjectMgtComponent,
  ],
})
export class CreativeBrandCampaignProjectMgtModule { }
