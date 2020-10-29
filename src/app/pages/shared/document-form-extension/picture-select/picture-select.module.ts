import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DragScrollModule } from 'ngx-drag-scroll';
import { PictureSelectComponent } from './picture-select.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DragScrollModule,
  ],
  exports: [
    PictureSelectComponent,
  ],
  declarations: [
    PictureSelectComponent,
  ],
})
export class PictureSelectModule {

}
