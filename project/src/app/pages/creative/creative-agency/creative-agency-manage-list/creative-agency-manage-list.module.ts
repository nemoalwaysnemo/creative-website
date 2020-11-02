import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { CreativeAgencyManageListComponent } from './creative-agency-manage-list.component';
import { CreativeAgencyInfoViewModule } from '../creative-agency-info-view/creative-agency-info-view.module';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    CreativeAgencyInfoViewModule,
  ],
  declarations: [
    CreativeAgencyManageListComponent,
  ],
})
export class CreativeAgencyListManageModule { }
