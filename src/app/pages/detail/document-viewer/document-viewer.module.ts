import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentPdfViewerComponent } from './document-pdf-viewer/document-pdf-viewer.component';
import { DocumentImageViewerComponent } from './document-image-viewer/document-image-viewer.component';
import { DocumentVideoViewerComponent } from './document-video-viewer/document-video-viewer.component';
import { DocumentVideoPlayerComponent } from './document-video-viewer/document-video-player/document-video-player.component';
import { DocumentVideoStoryboardComponent } from './document-video-viewer/document-video-storyboard/document-video-storyboard.component';
import { SimplePdfViewerModule } from 'simple-pdf-viewer';
import { ImageViewerModule } from 'ngx-image-viewer';
import { ThemeModule } from '@theme/theme.module';
import { DocumentViewerComponent } from '@pages/detail/document-viewer/document-viewer.component';
import { DocumentVideoViewerService } from '@pages/detail/document-viewer/document-video-viewer/document-video-viewer.service';
import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    SimplePdfViewerModule,
    ImageViewerModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
  ],
  declarations: [
    DocumentPdfViewerComponent,
    DocumentImageViewerComponent,
    DocumentViewerComponent,
    DocumentVideoViewerComponent,
    DocumentVideoPlayerComponent,
    DocumentVideoStoryboardComponent,
  ],
  exports: [
    DocumentViewerComponent,
  ],
  providers: [
    DocumentVideoViewerService,
  ],
})
export class DocumentViewerModule {
}
