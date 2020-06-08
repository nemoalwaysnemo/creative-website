import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DocumentCreativeProjectInfoComponent } from './document-creative-project-info.component';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
  ],
  declarations: [
    DocumentCreativeProjectInfoComponent,
  ],
  exports: [
    DocumentCreativeProjectInfoComponent,
  ],
  entryComponents: [
    DocumentCreativeProjectInfoComponent,
  ],
})
export class DocumentCreativeProjectInfoModule {
}
