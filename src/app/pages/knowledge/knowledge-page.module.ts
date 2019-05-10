import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { KnowledgePageComponent } from './knowledge-page.component';
import { KnowledgePageRoutingModule } from './knowledge-page-routing.module';
import { KnowledgeHomePageModule } from './knowledge-home/knowledge-home.module';

@NgModule({
  imports: [
    ThemeModule,
    KnowledgePageRoutingModule,
    KnowledgeHomePageModule,
  ],
  declarations: [
    KnowledgePageComponent,
  ],
})
export class KnowledgePageModule {
}
