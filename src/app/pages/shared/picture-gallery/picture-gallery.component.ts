import { Params } from '@angular/router';
import { GoogleAnalyticsService } from '@core/services';
import { deepExtend } from '@core/services/helpers';
import { PictureGallerySettings } from './picture-gallery.interface';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Component, Inject, AfterViewInit, Input, Output, OnInit, OnDestroy, TemplateRef, EventEmitter } from '@angular/core';
import { Gallery, GalleryRef, GalleryItem, GALLERY_CONFIG, GalleryState, GalleryItemType } from '@core/custom/ngx-gallery/core/index';

@Component({
  selector: 'picture-gallery',
  styleUrls: ['./picture-gallery.component.scss'],
  templateUrl: './picture-gallery.component.html',
})
export class PictureGalleryComponent implements OnInit, OnDestroy, AfterViewInit {

  queryParams: Params[] = [];

  @Input() gallerySettings: PictureGallerySettings = new PictureGallerySettings();

  @Input() customTemplate: TemplateRef<any>;

  @Input()
  set customEvent(name: string) {
    this.event$.next(name);
  }

  @Input()
  set galleryItems(items: GalleryItem[]) {
    if (items) {
      this.updateGalleryItems(items);
    }
  }

  @Output() playingChange = new EventEmitter<GalleryState>();

  galleryRef: GalleryRef;

  private galleryId = 'pictureGallery';

  private videoPlayers: HTMLMediaElement[] = [];

  private subscription: Subscription = new Subscription();

  private event$: BehaviorSubject<string> = new BehaviorSubject<string>('play');

  constructor(
    private gallery: Gallery,
    @Inject(GALLERY_CONFIG) private options,
    private googleAnalyticsService: GoogleAnalyticsService,
  ) {
    this.galleryRef = this.gallery.ref(this.galleryId);
  }

  ngOnInit(): void {
    this.subscribeEvents();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    if (this.gallerySettings.galleryConfig) {
      this.galleryRef.setConfig(deepExtend(this.options, this.gallerySettings.galleryConfig));
    }
  }

  getAssetUrl(uid: string): string {
    return this.gallerySettings.assetUrl.replace(':uid', uid);
  }

  onCustomEvent(e: any): void {
    const { itemIndex, event } = e;
    if (event.type === 'video') {
      this.videoAutoplayEnd(event); // End of video playback
      this.googleAnalyticsService.trackEvent({
        'event_category': 'Video',
        'event_action': `Video ${event.state}`,
        'event_label': `Video ${event.state} - ${event.title}`,
        'event_value': event.uid,
        'dimensions.docId': event.uid,
        'dimensions.docTitle': event.title,
      });
      // this.displayTitle = event.api.getDefaultMedia().state !== 'playing';
      this.videoPlayers[itemIndex] = event.player;
    }
  }

  onIndexChange(e: GalleryState): any {
    this.videoAutoplayStart(e);
  }

  onPlayingChange(e: GalleryState): void {
    if (e.items && e.items.length > 0) {
      if (e.isPlaying) {
        this.videoAutoplayStart(e);
      }
      this.playingChange.emit(e);
    }
  }

  onClick(i: number): void {
    if (this.videoPlayers[i]) {
      const currentTime = this.videoPlayers[i].currentTime;
      this.queryParams[i] = { currentTime };
    }
  }

  private videoAutoplayEnd(event: any = {}): void {
    if (this.gallerySettings.enableVideoAutoplay && event.state === 'ended') {
      this.event$.next('next');
      this.event$.next('play');
    }
  }

  private videoAutoplayStart(state: GalleryState): void {
    if (this.gallerySettings.enableVideoAutoplay) {
      const current = state.items[state.currIndex];
      if (current && current.type === GalleryItemType.Video) {
        this.event$.next('stop');
        this.galleryRef.updateItem(state.currIndex, { videoAction: 'play' });
      }
    }
  }

  private subscribeEvents(): void {
    const subscription = this.event$.subscribe((event: string) => {
      switch (event) {
        case 'play':
          this.galleryRef.play();
          break;
        case 'stop':
          this.galleryRef.stop();
          break;
        case 'next':
          this.galleryRef.next();
          break;
        case 'prev':
          this.galleryRef.prev();
          break;
        default:
          this.galleryRef.play();
          break;
      }
    });
    this.subscription.add(subscription);
  }

  private updateGalleryItems(items: GalleryItem[]): void {
    items.forEach((item: any) => {
      if (item['poster']) {
        this.galleryRef.addVideo(item);
      } else {
        this.galleryRef.addImage(item);
      }
    });
    this.galleryRef.play();
  }

}
