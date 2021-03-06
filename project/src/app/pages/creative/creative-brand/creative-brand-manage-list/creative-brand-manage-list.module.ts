import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { CreativeBrandManageListComponent } from './creative-brand-manage-list.component';
import { CreativeBrandInfoViewModule } from '../creative-brand-info-view/creative-brand-info-view.module';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    CreativeBrandInfoViewModule,
  ],
  declarations: [
    CreativeBrandManageListComponent,
  ],
})
export class CreativeBrandListManageModule { }
