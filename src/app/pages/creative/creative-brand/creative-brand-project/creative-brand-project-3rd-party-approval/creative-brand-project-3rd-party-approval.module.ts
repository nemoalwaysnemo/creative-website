import { NgModule } from '@angular/core';
import { SharedModule } from '@pages/shared/shared.module';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { ThemeModule } from '@theme/theme.module';
import { CreativeBrandInfoViewModule } from '../../creative-brand-info-view/creative-brand-info-view.module';
import { CreativeBrandFormButtonModule } from '../../creative-brand-form-button/creative-brand-form-button.module';
import { CreativeBrandProject3rdPartyApprovalComponent } from '../creative-brand-project-3rd-party-approval/creative-brand-project-3rd-party-approval.component';
@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    CreativeBrandFormButtonModule,
    CreativeBrandInfoViewModule,
  ],
  declarations: [
    CreativeBrandProject3rdPartyApprovalComponent,
  ],
})
export class CreativeBrandProject3rdPartyApprovalModule { }
