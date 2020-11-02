import { NgModule } from '@angular/core';
import { SharedModule } from '@pages/shared/shared.module';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { ThemeModule } from '@theme/theme.module';
import { CreativeBrandProjectComponent } from './creative-brand-project.component';
import { CreativeBrandInfoViewModule } from '../creative-brand-info-view/creative-brand-info-view.module';
import { CreativeBrandFormButtonModule } from '../creative-brand-form-button/creative-brand-form-button.module';

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
    CreativeBrandProjectComponent,
  ],
})
export class CreativeBrandProjectModule { }
