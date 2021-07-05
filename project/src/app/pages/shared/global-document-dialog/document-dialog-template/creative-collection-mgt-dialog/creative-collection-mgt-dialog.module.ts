import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { CreativeCollectionMgtDialogComponent } from './creative-collection-mgt-dialog.component';
import { GlobalSearchFormModule } from '../../../../shared/global-search-form/global-search-form.module';
import { CreativeRingFormButtonModule } from '../../../../creative/creative-ring/creative-ring-form-button/creative-ring-form-button.module';
import { GlobalSearchMoreResultInDialogModule } from '../../../../shared/global-search-more-result-in-dialog/global-search-more-result-in-dialog.module';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    GlobalSearchFormModule,
    GlobalSearchMoreResultInDialogModule,
    // CreativeRingFormButtonModule,
  ],
  declarations: [
    CreativeCollectionMgtDialogComponent,
  ],
  exports: [
    CreativeCollectionMgtDialogComponent,
  ],
})
export class CreativeCollectionMgtDialogModule {
}
