import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@pages/shared/shared.module';
import { DisruptionHomeComponent } from './disruption-home.component';
import { DisruptionHomeXModule } from './disruption-home-x/disruption-home-x.module';
import { DisruptionHomeGalleryModule } from './disruption-home-gallery/disruption-home-gallery.module';
import { DisruptionHomeResourceModule } from './disruption-home-resource/disruption-home-resource.module';

@NgModule({
  imports: [
    ThemeModule,
    RouterModule,
    SharedModule,
    DisruptionHomeXModule,
    DisruptionHomeGalleryModule,
    DisruptionHomeResourceModule,
  ],
  declarations: [
    DisruptionHomeComponent,
  ],
})
export class DisruptionHomeModule { }
