import { Component, Input, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { VgAPI } from 'videogular2/compiled/core';

@Component({
  selector: 'gallery-video',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vg-player (onPlayerReady)="onPlayerReady($event)">
      <vg-overlay-play vgFor="video"></vg-overlay-play>
      <video [vgMedia]="video" #video id="video" preload="auto" poster="{{poster}}" (error)="error.emit($event)">
          <source *ngFor="let src of videoSources" src="{{src?.url}}" type="{{src?.type}}">
      </video>
    </vg-player>
  `,
})
export class GalleryVideoComponent implements OnInit {

  preload: string = 'auto';

  api: VgAPI;

  videoSources: { url: string, type?: string }[];

  @Input() src: string | { url: string, type?: string }[];
  @Input() poster: string;

  @Input('pause') set pauseVideo(shouldPause: boolean) {
    const video: HTMLVideoElement = this.video.nativeElement;
    if (shouldPause && !video.paused) {
      video.pause();
    }
  }

  /** Stream that emits when an error occurs */
  @Output() error = new EventEmitter<Error>();

  @Output() customEvent = new EventEmitter<any>();

  @ViewChild('video', { static: true }) video: ElementRef;

  ngOnInit() {
    if (this.src instanceof Array) {
      // If video has multiple sources
      this.videoSources = [...this.src];
    } else {
      this.videoSources = [{ url: this.src }];
    }
  }

  onPlayerReady(api: VgAPI) {
    this.api = api;

    const defaultMedia = this.api.getDefaultMedia();
    const events = defaultMedia.subscriptions;

    events.playing.subscribe(() => {
      this.customEvent.emit({ api: this.api, player: this.getPlayer() });
    });

    events.pause.subscribe(() => {
      this.customEvent.emit({ api: this.api, player: this.getPlayer() });
    });

  }

  private getPlayer(): HTMLVideoElement {
    return this.video.nativeElement;
  }
}
