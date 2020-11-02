import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { KnowledgePageComponent } from './knowledge-page.component';
import { KnowledgeHomeModule } from './knowledge-home/knowledge-home.module';
import { KnowledgePageRoutingModule } from './knowledge-page-routing.module';

@NgModule({
  imports: [
    ThemeModule,
    KnowledgeHomeModule,
    KnowledgePageRoutingModule,
  ],
  declarations: [
    KnowledgePageComponent,
  ],
})
export class KnowledgePageModule {
}
