import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { RouterModule } from '@angular/router';
import { HomeSearchFormModule } from '@pages/shared';
import { SharedModule } from '@pages/shared/shared.module';
import { KnowledgeHomeComponent } from './knowledge-home.component';

@NgModule({
  imports: [
    ThemeModule,
    RouterModule,
    SharedModule,
    HomeSearchFormModule,
  ],
  declarations: [
    KnowledgeHomeComponent,
  ],
})
export class KnowledgeHomeModule { }
