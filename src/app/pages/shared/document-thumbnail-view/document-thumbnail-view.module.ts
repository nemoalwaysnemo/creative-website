import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DocumentThumbnailViewComponent } from './document-thumbnail-view.component';
import { DocumentThumbnailViewSelectableDirective } from './document-thumbnail-view.directive';

const COMPONENTS = [
  DocumentThumbnailViewComponent,
  DocumentThumbnailViewSelectableDirective,
];

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
  ],
  declarations: [
    ...COMPONENTS,
  ],
  exports: [
    ...COMPONENTS,
  ],
})
export class DocumentThumbnailViewModule {

}
