import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { KnowledgeRelatedInfoComponent } from './knowledge-related-info.component';
import { KnowledgeRelatedInfoViewModule } from './knowledge-related-info-view/knowledge-related-info-view.module';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    KnowledgeRelatedInfoViewModule,
  ],
  declarations: [
    KnowledgeRelatedInfoComponent,
  ],
  exports: [
    KnowledgeRelatedInfoComponent,
  ],
})
export class KnowledgeRelatedInfoModule {
}
