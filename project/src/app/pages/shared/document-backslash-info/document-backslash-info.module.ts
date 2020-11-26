import { NgModule } from '@angular/core';
import { NgPipesModule } from 'ngx-pipes';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DocumentBackslashInfoComponent } from './document-backslash-info.component';
import { DocumentShareButtonModule } from '../document-share-button/document-share-button.module';
import { DocumentNewPosterButtonModule } from '../document-new-poster-button/document-new-poster-button.module';

@NgModule({
  imports: [
    ThemeModule,
    NgPipesModule,
    CommonModule,
    DocumentShareButtonModule,
    DocumentNewPosterButtonModule,
  ],
  declarations: [
    DocumentBackslashInfoComponent,
  ],
  exports: [
    DocumentBackslashInfoComponent,
  ],
})
export class DocumentBackslashInfoModule {
}
