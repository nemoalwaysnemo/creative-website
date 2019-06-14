import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentFormModule } from '../document-form/document-form.module';
import { DisruptionFormFolderComponent } from './disruption-form-folder.component';

@NgModule({
  imports: [
    CommonModule,
    DocumentFormModule,
  ],
  declarations: [
    DisruptionFormFolderComponent,
  ],
  exports: [
    DisruptionFormFolderComponent,
  ],
})
export class DisruptionFormFolderModule { }
