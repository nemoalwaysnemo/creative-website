import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NbSpinnerModule } from '@core/nebular/theme';
import { GlobalDocumentDialogModule } from '@pages/shared';
import { CreativeRingBrandCollectionViewComponent } from './creative-ring-brand-collection-view.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NbSpinnerModule,
    GlobalDocumentDialogModule,
  ],
  declarations: [
    CreativeRingBrandCollectionViewComponent,
  ],
  exports: [
    CreativeRingBrandCollectionViewComponent,
  ],
})

export class CreativeRingBrandCollectionViewModule {

}
