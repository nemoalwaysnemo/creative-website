import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { LibraryManageComponent } from './library-manage.component';
import { SharedModule } from '@pages/shared/shared.module';
import { SharedServiceModule } from '@pages/shared';


@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    LibraryManageComponent,
  ],
  providers: [
    ...SharedServiceModule.forRoot().providers,
  ],
})
export class LibraryManagePageModule { }
