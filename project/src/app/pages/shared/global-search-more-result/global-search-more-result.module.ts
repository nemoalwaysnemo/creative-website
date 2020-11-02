import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeModule } from '@theme/theme.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PaginationModule } from '../pagination/pagination.module';
import { DocumentViewerModule } from '../document-viewer/document-viewer.module';
import { GlobalSearchMoreResultComponent } from './global-search-more-result.component';
import { DocumentListViewModule } from '../document-list-view/document-list-view.module';
import { GlobalDocumentDialogModule } from '../global-document-dialog/global-document-dialog.module';
import { DocumentThumbnailViewModule } from '../document-thumbnail-view/document-thumbnail-view.module';

const COMPONENTS = [
  GlobalSearchMoreResultComponent,
];

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    RouterModule,
    PaginationModule,
    InfiniteScrollModule,
    DocumentViewerModule,
    DocumentListViewModule,
    DocumentThumbnailViewModule,
    GlobalDocumentDialogModule,
  ],
  declarations: [
    ...COMPONENTS,
  ],
  exports: [
    ...COMPONENTS,
  ],
})
export class GlobalSearchMoreResultModule { }
