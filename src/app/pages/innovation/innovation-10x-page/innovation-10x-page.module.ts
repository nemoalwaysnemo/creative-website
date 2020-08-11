import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbSpinnerModule } from '@core/nebular/theme';
import { Innovation10xComponent } from './innovation-10x-page.component';

@NgModule({
  imports: [
    CommonModule,
    NbSpinnerModule,
  ],
  declarations: [
    Innovation10xComponent,
  ],
})
export class Innovation10xPageModule {
}
