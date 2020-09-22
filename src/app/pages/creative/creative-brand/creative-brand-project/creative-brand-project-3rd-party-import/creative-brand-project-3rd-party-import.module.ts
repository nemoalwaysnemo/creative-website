import { NgModule } from '@angular/core';
import { SharedModule } from '@pages/shared/shared.module';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { ThemeModule } from '@theme/theme.module';
import { CreativeBrandProject3rdPartyImportComponent } from './creative-brand-project-3rd-party-import.component';
import { CreativeBrandFormButtonModule } from '../../creative-brand-form-button/creative-brand-form-button.module';
@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    CreativeBrandFormButtonModule,
  ],
  declarations: [
    CreativeBrandProject3rdPartyImportComponent,
  ],
})
export class CreativeBrandProject3rdPartyImportModule { }
