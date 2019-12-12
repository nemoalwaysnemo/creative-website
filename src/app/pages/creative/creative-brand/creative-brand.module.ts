import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { CreativeBrandComponent } from './creative-brand.component';
import { SharedModule } from '@pages/shared/shared.module';
import { GlobalSearchFormModule, GlobalSearchResultModule, SharedServiceModule, PreviewDialogModule } from '@pages/shared';
import { CreativeBrandAudioComponent } from './creative-brand-audio/creative-brand-audio.component';
import { CreativeFormAudioModule } from '@pages/shared/creative-form-audio/creative-form-audio.module';
import { CreativeBrandImageComponent } from './creative-brand-image/creative-brand-image.component';
import { CreativeBrandVideoComponent } from './creative-brand-video/creative-brand-video.component';
import { CreativeFormVideoModule } from '@pages/shared/creative-form-video/creative-form-video.module';
import { CreativeFormImageModule } from '@pages/shared/creative-form-image/creative-form-image.module';
import { CreativeFormMainModulesModule } from '@pages/shared/creative-form-main-modules/creative-form-main-modules.module';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    PreviewDialogModule,
    CreativeFormAudioModule,
    CreativeFormImageModule,
    CreativeFormVideoModule,
    CreativeFormMainModulesModule,
  ],
  declarations: [
    CreativeBrandComponent,
    CreativeBrandAudioComponent,
    CreativeBrandImageComponent,
    CreativeBrandVideoComponent,
  ],
  providers: [
    ...SharedServiceModule.forRoot().providers,
  ],
})
export class CreativeBrandModule { }
