import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreativeFormAudioComponent } from './creative-form-audio.component';
import { DocumentFormModule } from '../document-form/document-form.module';

@NgModule({
  imports: [
    CommonModule,
    DocumentFormModule,
  ],
  declarations: [
    CreativeFormAudioComponent,
  ],
  exports: [
    CreativeFormAudioComponent,
  ],
})
export class CreativeFormAudioModule { }
