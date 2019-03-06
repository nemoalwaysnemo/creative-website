import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgPipesModule } from 'ngx-pipes';
import { SharedDirectiveModule } from '../directives/shared-directive.module';
import { CreativeThumbnailViewComponent, CreativeThumbnailViewItemComponent } from './thumbnail-view.component';
import { ThemeModule } from '@theme/theme.module';
import { PreviewDialogModule } from '../preview-dialog';

const COMPONENTS = [CreativeThumbnailViewComponent, CreativeThumbnailViewItemComponent];

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    RouterModule,
    NgPipesModule,
    SharedDirectiveModule,
    PreviewDialogModule,
  ],
  declarations: [...COMPONENTS],
  exports: [
    ...COMPONENTS,
  ],
})
export class CreativeThumbnailViewModule {

}
