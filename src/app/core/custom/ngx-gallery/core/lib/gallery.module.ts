import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { GalleryConfig, GALLERY_CONFIG } from './models/config.model';

import { GalleryComponent } from './components/gallery.component';
import { GalleryNavComponent } from './components/gallery-nav.component';
import { GalleryCoreComponent } from './components/gallery-core.component';
import { GalleryDotsComponent } from './components/gallery-dots.component';
import { GalleryThumbsComponent } from './components/gallery-thumbs.component';
import { GallerySliderComponent } from './components/gallery-slider.component';
import { GalleryCounterComponent } from './components/gallery-counter.component';

import { GalleryItemComponent } from './components/gallery-item.component';
import { GalleryThumbComponent } from './components/gallery-thumb.component';
import { GalleryImageComponent } from './components/templates/gallery-image.component';
import { GalleryVideoComponent } from './components/templates/gallery-video.component';
import { GalleryIframeComponent } from './components/templates/gallery-iframe.component';
import { RadialProgressComponent } from './components/templates/radial-progress.component';

import { LazyImageDirective } from './directives/lazy-image';
import { TapClickDirective } from './directives/tap-click';
import { CachingInterceptor } from './services/cache.interceptor';
import { RequestCache, RequestCacheWithMap } from './services/cache.service';

import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
  ],
  providers: [
    {provide: RequestCache, useClass: RequestCacheWithMap},
    {provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true},
  ],
  declarations: [
    GalleryComponent,
    GalleryNavComponent,
    GalleryDotsComponent,
    GalleryCoreComponent,
    GallerySliderComponent,
    GalleryCounterComponent,
    GalleryThumbsComponent,
    GalleryThumbComponent,
    GalleryItemComponent,
    GalleryImageComponent,
    GalleryVideoComponent,
    GalleryIframeComponent,
    RadialProgressComponent,
    LazyImageDirective,
    TapClickDirective,
  ],
  exports: [
    GalleryComponent,
    LazyImageDirective,
    TapClickDirective,
  ],
})
export class GalleryModule {
  static withConfig(config: GalleryConfig): ModuleWithProviders {

    return {
      ngModule: GalleryModule,
      providers: [
        {
          provide: GALLERY_CONFIG,
          useValue: config,
        },
      ],
    };
  }
}
