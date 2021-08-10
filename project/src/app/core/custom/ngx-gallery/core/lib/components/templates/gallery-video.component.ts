import { Component, Input, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { VgApiService } from '@videogular/ngx-videogular/core';

@Component({
  selector: 'gallery-video',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vg-player (onPlayerReady)="onPlayerReady($event)">
      <vg-overlay-play vgFor="video"></vg-overlay-play>
      <video [vgMedia]="video" #video id="video" [preload]="preload" [poster]="poster" (error)="error.emit($event)">
        <source *ngFor="let videoSource of videoSources" [src]="videoSource['url']" [type]="videoSource['type']" [attr.source-info]="videoSource['name']">
      </video>
    </vg-player>
  `,
})
export class GalleryVideoComponent implements OnInit {

  @Input() src: string | { url: string; type?: string }[];

  @Input() poster: string;

  @Input() title: string;

  @Input('pause')
  set pauseVideo(shouldPause: boolean) {
    const video: HTMLVideoElement = this.getPlayer();
    if (shouldPause && !video.paused) {
      this.performSettings({ videoAction: 'pause' });
    }
  }

  @Input()
  set settings(settings: any) {
    if (settings) {
      this.performSettings(settings);
    }
  }

  /** Stream that emits when an error occurs */
  @Output() error: EventEmitter<Error> = new EventEmitter<Error>();

  @Output() customEvent: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('video', { static: true }) video: ElementRef;

  preload: string = 'metadata';

  videoSources: { url: string; type?: string }[];

  constructor(private api: VgApiService) {
  }

  ngOnInit(): void {
    if (this.src instanceof Array) {
      // If video has multiple sources
      this.videoSources = [...this.src];
    } else {
      this.videoSources = [{ url: this.src }];
    }
  }

  onPlayerReady(api: VgApiService): void {
    this.api = api;
    const defaultMedia = this.api.getDefaultMedia();
    const events = defaultMedia.subscriptions;

    events.play.subscribe(() => {
      this.customEvent.emit({ type: 'video', state: 'play', api: this.api, player: this.getPlayer() });
    });

    events.pause.subscribe(() => {
      this.customEvent.emit({ type: 'video', state: 'pause', api: this.api, player: this.getPlayer() });
    });

    events.ended.subscribe(() => {
      this.customEvent.emit({ type: 'video', state: 'ended', api: this.api, player: this.getPlayer() });
    });
  }

  private performSettings(settings: any = {}): void {
    try {
      switch (settings.videoAction) {
        case 'play':
          this.api.play();
          break;
        case 'pause':
          this.api.pause();
          break;
        default:
          break;
      }
    } catch (error) {

    }
  }

  private getPlayer(): HTMLVideoElement {
    return this.video.nativeElement;
  }
}
