import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { SelectableItemModule } from '../document-selectable/selectable-item/selectable-item.module';
import { DocumentThumbnailViewComponent } from './document-thumbnail-view.component';

const COMPONENTS = [
  DocumentThumbnailViewComponent,
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
