import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { CommonModule } from '@angular/common';
import { CreativeBrandPageComponent } from './creative-brand-page.component';
import { CreativeBrandAssetModule } from './creative-brand-asset/creative-brand-asset.module';
import { CreativeBrandShowcaseModule } from './creative-brand-showcase/creative-brand-showcase.module';
import { CreativeBrandUsageRightsModule } from './creative-brand-usage-rights/creative-brand-usage-rights.module';
import { CreativeBrandListManageModule } from './creative-brand-manage-list/creative-brand-manage-list.module';
import { CreativeBrandManageLibraryModule } from './creative-brand-manage-library/creative-brand-manage-library.module';
import { CreativeBrandCampaignModule } from './creative-brand-campaign/creative-brand-campaign.module';

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    CreativeBrandAssetModule,
    CreativeBrandShowcaseModule,
    CreativeBrandCampaignModule,
    CreativeBrandUsageRightsModule,
    CreativeBrandListManageModule,
    CreativeBrandManageLibraryModule,
  ],
  declarations: [
    CreativeBrandPageComponent,
  ],
})
export class CreativeBrandPageModule { }
