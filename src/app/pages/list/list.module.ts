import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { ListComponent } from './list.component';
import { ListResultsComponent } from './list-results/list-results.component';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    ListComponent,
    ListResultsComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
  ],
})
export class ListPageModule { }
