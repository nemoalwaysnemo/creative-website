import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { RouterModule } from '@angular/router';
import { HomeSearchFormModule } from '@pages/shared';
import { SharedModule } from '@pages/shared/shared.module';
import { DisruptionHomeComponent } from './disruption-home.component';
import { DisruptionHomeGalleryModule } from './disruption-home-gallery/disruption-home-gallery.module';
import { DisruptionHomeResourceModule } from './disruption-home-resource/disruption-home-resource.module';

@NgModule({
  imports: [
    ThemeModule,
    RouterModule,
    SharedModule,
    HomeSearchFormModule,
    DisruptionHomeGalleryModule,
    DisruptionHomeResourceModule,
  ],
  declarations: [
    DisruptionHomeComponent,
  ],
})
export class DisruptionHomeModule { }
