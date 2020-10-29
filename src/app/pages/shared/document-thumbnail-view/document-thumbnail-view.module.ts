import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { SelectableItemModule } from '../document-selectable/selectable-item/selectable-item.module';
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
    SelectableItemModule,
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
