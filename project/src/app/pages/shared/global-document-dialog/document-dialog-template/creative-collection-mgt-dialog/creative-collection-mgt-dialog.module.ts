import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { CreativeCollectionMgtDialogComponent } from './creative-collection-mgt-dialog.component';
import { GlobalSearchFormModule } from '../../../../shared/global-search-form/global-search-form.module';
import { GlobalSearchMoreResultInDialogModule } from '../../../../shared/global-search-more-result-in-dialog/global-search-more-result-in-dialog.module';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    GlobalSearchFormModule,
    GlobalSearchMoreResultInDialogModule,
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
