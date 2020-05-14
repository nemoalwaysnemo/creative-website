import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { CommonModule } from '@angular/common';
import { CreativeAgencyPageComponent } from './creative-agency-page.component';
import { CreativeAgencyBrandModule } from './creative-agency-brand/creative-agency-brand.module';
import { CreativeAgencyShowcaseModule } from './creative-agency-showcase/creative-agency-showcase.module';
import { CreativeAgencyListManageModule } from './creative-agency-manage-list/creative-agency-manage-list.module';
import { CreativeAgencyManageLibraryModule } from './creative-agency-manage-library/creative-agency-manage-library.module';

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    CreativeAgencyBrandModule,
    CreativeAgencyShowcaseModule,
    CreativeAgencyListManageModule,
    CreativeAgencyManageLibraryModule,
  ],
  declarations: [
    CreativeAgencyPageComponent,
  ],
})
export class CreativeAgencyPageModule { }
