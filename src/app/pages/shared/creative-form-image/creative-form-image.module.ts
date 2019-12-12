import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentFormModule } from '../document-form/document-form.module';
import { CreativeFormImageComponent } from './creative-form-image.component';

@NgModule({
  imports: [
    CommonModule,
    DocumentFormModule,
  ],
  declarations: [
    CreativeFormImageComponent,
  ],
  exports: [
    CreativeFormImageComponent,
  ],
})
export class CreativeFormImageModule { }
