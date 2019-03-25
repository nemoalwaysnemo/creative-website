import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgPipesModule } from 'ngx-pipes';
import { SharedDirectiveModule } from '../directives/shared-directive.module';
import { CreativeThumbnailViewComponent, CreativeThumbnailViewItemComponent } from './thumbnail-view.component';
import { ThemeModule } from '@theme/theme.module';
import { PreviewDialogModule } from '../preview-dialog';
import { DocumentViewerModule } from '../document-viewer/document-viewer.module';
import { BackslashDialogComponent } from './backslash-dialog/backslash-dialog.component';
import { DisruptionDialogComponent } from './disruption-dialog/disruption-dialog.component';
import { IntelligenceDialogComponent } from './intelligence-dialog/intelligence-dialog.component';

const COMPONENTS = [
  CreativeThumbnailViewComponent,
  CreativeThumbnailViewItemComponent,
];

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    RouterModule,
    NgPipesModule,
    SharedDirectiveModule,
    PreviewDialogModule,
    DocumentViewerModule,
  ],
  declarations: [
    ...COMPONENTS,
    BackslashDialogComponent,
    DisruptionDialogComponent,
    IntelligenceDialogComponent,
  ],
  exports: [
    ...COMPONENTS,
  ],
})
export class CreativeThumbnailViewModule {

}
