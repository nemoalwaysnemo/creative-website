import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentFormModule } from '../document-form/document-form.module';
import { CreativeFormVideoComponent } from './creative-form-video.component';

@NgModule({
  imports: [
    CommonModule,
    DocumentFormModule,
  ],
  declarations: [
    CreativeFormVideoComponent,
  ],
  exports: [
    CreativeFormVideoComponent,
  ],
})
export class CreativeFormVideoModule { }
