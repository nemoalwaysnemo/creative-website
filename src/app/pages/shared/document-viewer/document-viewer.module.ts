import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentPdfViewerComponent } from './document-pdf-viewer/document-pdf-viewer.component';
import { DocumentImageViewerComponent } from './document-image-viewer/document-image-viewer.component';
import { DocumentVideoViewerComponent } from './document-video-viewer/document-video-viewer.component';
import { DocumentVideoPlayerComponent } from './document-video-viewer/document-video-player/document-video-player.component';
import { DocumentVideoStoryboardComponent } from './document-video-viewer/document-video-storyboard/document-video-storyboard.component';
import { DocumentAudioViewerComponent } from './document-audio-viewer/document-audio-viewer.component';
import { ThemeModule } from '@theme/theme.module';
import { DocumentViewerComponent } from './document-viewer.component';
import { DocumentVideoViewerService } from './document-video-viewer/document-video-viewer.service';
import { VgCoreModule } from 'videogular2/compiled/core';
import { VgControlsModule } from 'videogular2/compiled/controls';
import { VgOverlayPlayModule } from 'videogular2/compiled/overlay-play';
import { VgBufferingModule } from 'videogular2/compiled/buffering';
import { DragScrollModule } from 'ngx-drag-scroll';
import { DocumentRelatedCampaignComponent } from './document-related-campaign/document-related-campaign.component';
@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    DragScrollModule,
  ],
  declarations: [
    DocumentPdfViewerComponent,
    DocumentImageViewerComponent,
    DocumentViewerComponent,
    DocumentVideoViewerComponent,
    DocumentVideoPlayerComponent,
    DocumentVideoStoryboardComponent,
    DocumentAudioViewerComponent,
    DocumentRelatedCampaignComponent,
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
