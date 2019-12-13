import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { CreativeBrandLibraryManageComponent } from './creative-brand-library-manage.component';
import { SharedModule } from '@pages/shared/shared.module';
import { SharedServiceModule } from '@pages/shared';
import { NbToastrModule } from '@core/nebular/theme';
import { CreativeBrandInfoViewModule } from '../creative-brand-info-view/creative-brand-info-view.module';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    NbToastrModule.forRoot(),
    CreativeBrandInfoViewModule,
  ],
  declarations: [
    CreativeBrandLibraryManageComponent,
  ],
  providers: [
    ...SharedServiceModule.forRoot().providers,
  ],
})
export class CreativeBrandLibraryManageModule { }
