import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedDirectiveModule } from '../directives/shared-directive.module';
import { ThumbnailViewComponent, ThumbnailViewItemComponent } from './thumbnail-view.component';
import { ThemeModule } from '@theme/theme.module';

const COMPONENTS = [ThumbnailViewComponent, ThumbnailViewItemComponent];

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    SharedDirectiveModule,
  ],
  declarations: [...COMPONENTS],
  exports: [
    ...COMPONENTS,
  ],
})
export class ThumbnailViewModule {

}
