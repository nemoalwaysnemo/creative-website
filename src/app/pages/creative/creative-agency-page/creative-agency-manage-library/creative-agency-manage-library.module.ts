import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { CreativeAgencyManageLibraryComponent } from './creative-agency-manage-library.component';
import { SharedModule } from '@pages/shared/shared.module';
import { NbToastrModule } from '@core/nebular/theme';
import { CreativeAgencyInfoViewModule } from '../creative-agency-info-view/creative-agency-info-view.module';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    NbToastrModule.forRoot(),
    CreativeAgencyInfoViewModule,
  ],
  declarations: [
    CreativeAgencyManageLibraryComponent,
  ],
})
export class CreativeAgencyManageLibraryModule { }
