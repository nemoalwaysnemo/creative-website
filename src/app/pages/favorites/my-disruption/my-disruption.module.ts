import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { GlobalSearchFormModule, GlobalSearchResultModule, PreviewDialogModule  } from '@pages/shared';
import { MyDisruptionComponent } from './my-disruption.component';
@NgModule({
  imports: [
    ThemeModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    PreviewDialogModule,
  ],
  declarations: [
    MyDisruptionComponent,
  ],
  providers: [
  ],
})
export class MyDisruptionModule { }
