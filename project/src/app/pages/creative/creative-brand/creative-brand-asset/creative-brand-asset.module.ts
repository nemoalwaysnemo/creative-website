import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { CreativeBrandAssetComponent } from './creative-brand-asset.component';
import { GlobalSearchFormModule, GlobalSearchResultModule, SelectableActionBarModule } from '@pages/shared';
import { CreativeBrandInfoViewModule } from '../creative-brand-info-view/creative-brand-info-view.module';
import { CreativeBrandFormButtonModule } from '../creative-brand-form-button/creative-brand-form-button.module';
import { GlobalSearchButtonModule } from '../../../shared/global-search-button/global-search-button.module';

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    GlobalSearchButtonModule,
    CreativeBrandInfoViewModule,
    CreativeBrandFormButtonModule,
    SelectableActionBarModule,
  ],
  declarations: [
    CreativeBrandAssetComponent,
  ],
})
export class CreativeBrandAssetModule { }
