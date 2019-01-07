import { Component, Input, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { VgAPI } from 'videogular2/core';
@Component({
  selector: 'gallery-video',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vg-player (onPlayerReady)="onPlayerReady($event)">
        <video [vgMedia]="video" #video id="singleVideo" preload="auto" controls poster="{{poster}}" (error)="error.emit($event)">
            <source *ngFor="let src of videoSources" src="{{src?.url}}" type="{{src?.type}}">
        </video>
    </vg-player>
  `,
})
export class GalleryVideoComponent implements OnInit {

  preload: string = 'auto';
  api: VgAPI;

  videoSources: {url: string, type?: string}[];

  @Input() src: string | {url: string, type?: string}[];
  @Input() poster: string;

  @Input('pause') set pauseVideo(shouldPause: boolean) {
    const video: HTMLVideoElement = this.video.nativeElement;
    if (shouldPause && !video.paused) {
      video.pause();
    }
  }

  /** Stream that emits when an error occurs */
  @Output() error = new EventEmitter<Error>();
  @Output() playing = new EventEmitter<string | number>();

  @ViewChild('video') video: ElementRef;

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

    this.api.getDefaultMedia().subscriptions.playing.subscribe(
      () => {
        if ( this.api.getDefaultMedia().state === 'playing' ) {
            this.playing.emit( 'playing' );
        }
      },
    );
  }

}
