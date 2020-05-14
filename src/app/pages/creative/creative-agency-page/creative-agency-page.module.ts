import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { CommonModule } from '@angular/common';
import { CreativeAgencyPageComponent } from './creative-agency-page.component';
import { CreativeAgencyAssetModule } from './creative-agency-asset/creative-agency-asset.module';
import { CreativeAgencyShowcaseModule } from './creative-agency-showcase/creative-agency-showcase.module';
import { CreativeAgencyListManageModule } from './creative-agency-manage-list/creative-agency-manage-list.module';
import { CreativeAgencyManageLibraryModule } from './creative-agency-manage-library/creative-agency-manage-library.module';

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    CreativeAgencyAssetModule,
    CreativeAgencyShowcaseModule,
    CreativeAgencyListManageModule,
    CreativeAgencyManageLibraryModule,
  ],
  declarations: [
    CreativeAgencyPageComponent,
  ],
})
export class CreativeAgencyPageModule { }
