import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { CommonModule } from '@angular/common';
import { CreativeRingPageComponent } from './creative-ring.component';
import { CreativeRingCollectionModule } from './creative-ring-collection/creative-ring-collection.module';
import { CreativeRingBrandModule } from './creative-ring-brand/creative-ring-brand.module';
import { CreativeRingAgencyModule } from './creative-ring-agency/creative-ring-agency.module';
import { CreativeRingCollectionAssetModule } from './creative-ring-collection-asset/creative-ring-collection-asset.module';
import { CreativeRingBrandAssetModule } from './creative-ring-brand-asset/creative-ring-brand-asset.module';

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    CreativeRingCollectionModule,
    CreativeRingBrandModule,
    CreativeRingAgencyModule,
    CreativeRingCollectionAssetModule,
    CreativeRingBrandAssetModule,
  ],
  declarations: [
    CreativeRingPageComponent,
  ],
})
export class CreativeRingModule { }
