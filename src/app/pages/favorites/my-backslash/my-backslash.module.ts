import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { GlobalSearchFormModule, GlobalSearchResultModule, PreviewDialogModule  } from '@pages/shared';
import { MyBackslashComponent } from './my-backslash.component';
@NgModule({
  imports: [
    ThemeModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    PreviewDialogModule,
  ],
  declarations: [
    MyBackslashComponent,
  ],
  providers: [
  ],
})
export class MyBackslashModule { }
