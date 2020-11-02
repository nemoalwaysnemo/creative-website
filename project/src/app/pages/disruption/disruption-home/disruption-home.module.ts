import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { DisruptionHomeComponent } from './disruption-home.component';
import { RouterModule } from '@angular/router';
import { HomeSearchFormModule } from '@pages/shared';
import { DisruptionHomeGalleryComponent } from './disruption-home-gallery/disruption-home-gallery.component';
import { SharedModule } from '@pages/shared/shared.module';
@NgModule({
  imports: [
    ThemeModule,
    RouterModule,
    HomeSearchFormModule,
    SharedModule,
  ],
  declarations: [
    DisruptionHomeComponent,
    DisruptionHomeGalleryComponent,
  ],
})
export class DisruptionHomeModule { }
