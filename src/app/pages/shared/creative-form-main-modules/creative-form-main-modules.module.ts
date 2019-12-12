import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DocumentFormModule } from '../document-form/document-form.module';
import { CreativeFormMainModulesComponent } from './creative-form-main-modules.component';

@NgModule({
  imports: [
    CommonModule,
    DocumentFormModule,
    ThemeModule,
  ],
  declarations: [
    CreativeFormMainModulesComponent,
  ],
  exports: [
    CreativeFormMainModulesComponent,
  ],
})
export class CreativeFormMainModulesModule { }
