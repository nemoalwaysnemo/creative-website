import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { CommonModule } from '@angular/common';
import { CreativeBrandPageComponent } from './creative-brand.component';
import { CreativeBrandAssetModule } from './creative-brand-asset/creative-brand-asset.module';
import { CreativeBrandShowcaseModule } from './creative-brand-showcase/creative-brand-showcase.module';
import { CreativeBrandUsageRightsModule } from './creative-brand-usage-rights/creative-brand-usage-rights.module';
import { CreativeBrandListManageModule } from './creative-brand-manage-list/creative-brand-manage-list.module';
import { CreativeBrandManageLibraryModule } from './creative-brand-manage-library/creative-brand-manage-library.module';
import { CreativeBrandCampaignSummaryModule } from './creative-brand-campaign-summary/creative-brand-campaign-summary.module';
import { CreativeBrandCampaignModule } from './creative-brand-campaign/creative-brand-campaign.module';
import { CreativeBrandProjectModule } from './creative-brand-project/creative-brand-project.module';

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    CreativeBrandAssetModule,
    CreativeBrandShowcaseModule,
    CreativeBrandCampaignModule,
    CreativeBrandProjectModule,
    CreativeBrandUsageRightsModule,
    CreativeBrandListManageModule,
    CreativeBrandManageLibraryModule,
    CreativeBrandCampaignSummaryModule,
  ],
  declarations: [
    CreativeBrandPageComponent,
  ],
})
export class CreativeBrandModule { }
