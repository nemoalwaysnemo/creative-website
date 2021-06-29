import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { CommonModule } from '@angular/common';
import { CreativeRingPageComponent } from './creative-ring.component';
import { CreativeRingCollectionModule } from './creative-ring-collection/creative-ring-collection.module';
import { CreativeRingBrandModule } from './creative-ring-brand/creative-ring-brand.module';
import { CreativeRingAgencyModule } from './creative-ring-agency/creative-ring-agency.module';

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    CreativeRingCollectionModule,
    CreativeRingBrandModule,
    CreativeRingAgencyModule,
  ],
  declarations: [
    CreativeRingPageComponent,
  ],
})
export class CreativeRingModule { }
