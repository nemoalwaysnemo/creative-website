import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeModule } from '@theme/theme.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PaginationModule } from '../pagination/pagination.module';
import { DocumentViewerModule } from '../document-viewer/document-viewer.module';
import { GlobalSearchMoreResultInDialogComponent } from './global-search-more-result-in-dialog.component';
import { DocumentListViewModule } from '../document-list-view/document-list-view.module';
import { DocumentThumbnailViewModule } from '../document-thumbnail-view/document-thumbnail-view.module';

const COMPONENTS = [
  GlobalSearchMoreResultInDialogComponent,
];

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    PaginationModule,
    InfiniteScrollModule,
    DocumentViewerModule,
    DocumentListViewModule,
    DocumentThumbnailViewModule,
  ],
  declarations: [
    ...COMPONENTS,
  ],
  exports: [
    ...COMPONENTS,
  ],
})
export class GlobalSearchMoreResultInDialogModule { }
