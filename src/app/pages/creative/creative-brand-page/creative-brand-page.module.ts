import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { CommonModule } from '@angular/common';
import { CreativeBrandPageComponent } from './creative-brand-page.component';
import { CreativeBrandShowcaseModule } from './creative-brand-showcase/creative-brand-showcase.module';
import { CreativeBrandUsageRightsModule } from './creative-brand-usage-rights/creative-brand-usage-rights.module';
import { CreativeBrandListManageModule } from './creative-brand-manage-list/creative-brand-manage-list.module';
import { CreativeBrandManageLibraryModule } from './creative-brand-manage-library/creative-brand-manage-library.module';
import { CreativeBrandManageCampaignModule } from './creative-brand-manage-campaign/creative-brand-manage-campaign.module';

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    CreativeBrandShowcaseModule,
    CreativeBrandUsageRightsModule,
    CreativeBrandListManageModule,
    CreativeBrandManageLibraryModule,
    CreativeBrandManageCampaignModule,
  ],
  declarations: [
    CreativeBrandPageComponent,
  ],
})
export class CreativeBrandPageModule { }
