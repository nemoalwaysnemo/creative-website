import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { IntelligenceHomeComponent } from './intelligence-home.component';
import { RouterModule } from '@angular/router';
import { HomeSearchFormModule, GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { DisruptionFormButtonModule } from '../intelligence-form-button/intelligence-form-button.module';
import { GlobalDocumentFormModule } from '../../shared/global-document-form/global-document-form.module';

@NgModule({
  imports: [
    ThemeModule,
    HomeSearchFormModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    DisruptionFormButtonModule,
    GlobalDocumentFormModule,
  ],
  declarations: [
    IntelligenceHomeComponent,
  ],
})
export class IntelligenceHomeModule { }
