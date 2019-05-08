import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { KnowledgeHomeComponent } from './knowledge-home.component';
import { DocumentThumbnailViewModule } from '@pages/shared/document-thumbnail-view/document-thumbnail-view.module';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    RouterModule,
    DocumentThumbnailViewModule,
  ],
  declarations: [
    KnowledgeHomeComponent,
  ],
})
export class KnowledgeHomePageModule { }
