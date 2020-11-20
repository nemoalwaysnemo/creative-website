import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { DisruptionHomeGalleryComponent } from './disruption-home-gallery.component';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    DisruptionHomeGalleryComponent,
  ],
  exports: [
    DisruptionHomeGalleryComponent,
  ],
})
export class DisruptionHomeGalleryModule { }
