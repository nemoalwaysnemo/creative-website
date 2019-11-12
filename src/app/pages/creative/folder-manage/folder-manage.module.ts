import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { FolderManageComponent } from './folder-manage.component';
import { SharedModule } from '@pages/shared/shared.module';
import { SharedServiceModule } from '@pages/shared';


@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    FolderManageComponent,
  ],
  providers: [
    ...SharedServiceModule.forRoot().providers,
  ],
})
export class FolderManagePageModule { }
