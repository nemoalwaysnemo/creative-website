import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { ListComponent } from './list.component';

@NgModule({
  imports: [
    ThemeModule,
  ],
  declarations: [
    ListComponent,
  ],
})
export class ListPageModule { }
