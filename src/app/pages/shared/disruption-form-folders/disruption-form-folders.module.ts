import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentFormModule } from '../document-form/document-form.module';
import { DisruptionFormFoldersComponent } from './disruption-form-folders.component';

@NgModule({
  imports: [
    CommonModule,
    DocumentFormModule,
  ],
  declarations: [
    DisruptionFormFoldersComponent,
  ],
  exports: [
    DisruptionFormFoldersComponent,
  ],
})
export class DisruptionFormFoldersModule { }
