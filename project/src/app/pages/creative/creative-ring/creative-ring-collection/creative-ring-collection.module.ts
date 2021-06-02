import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { CreativeRingCollectionComponent } from './creative-ring-collection.component';
import { GlobalSearchFormModule, GlobalSearchResultModule, SelectableActionBarModule } from '@pages/shared';
import { CreativeRingFormButtonModule } from '../creative-ring-form-button/creative-ring-form-button.module';
import { GlobalSearchButtonModule } from '../../../shared/global-search-button/global-search-button.module';

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    GlobalSearchButtonModule,
    CreativeRingFormButtonModule,
    SelectableActionBarModule,
  ],
  declarations: [
    CreativeRingCollectionComponent,
  ],
})
export class CreativeRingCollectionModule { }
