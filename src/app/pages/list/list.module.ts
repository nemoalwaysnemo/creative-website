import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { ThumbnailViewModule } from '@pages/shared/thumbnail-view/thumbnail-view.module';
import { ListComponent } from './list.component';
import { ListResultsComponent } from './list-results/list-results.component';

@NgModule({
  imports: [
    ThemeModule,
    ThumbnailViewModule.forRoot(),
  ],
  declarations: [
    ListComponent,
    ListResultsComponent,
  ],
})
export class ListPageModule { }
