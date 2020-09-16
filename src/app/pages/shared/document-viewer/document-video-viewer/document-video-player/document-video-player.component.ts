import { Component, OnDestroy, Input, ChangeDetectionStrategy } from '@angular/core';
import { DocumentVideoViewerService, DocumentVideoEvent } from '../document-video-viewer.service';
import { VgApiService } from '@videogular/ngx-videogular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'document-video-player',
  styleUrls: ['./document-video-player.component.scss'],
  templateUrl: './document-video-player.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentVideoPlayerComponent implements OnDestroy {

  private subscription: Subscription = new Subscription();

  @Input() poster: string;

  @Input() videoSources: object;

  @Input() autoPlay: boolean;

  constructor(private documentVideoViewerService: DocumentVideoViewerService, private api: VgApiService) {
    this.subscription = this.documentVideoViewerService.onEvent('currentTimeChanged').subscribe((event: DocumentVideoEvent) => {
      this.api.currentTime = event.currentTime;
      this.api.play();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onPlayerReady(api: VgApiService): void {
    this.api = api;
    const defaultVolume = this.documentVideoViewerService.getCookie('defaultVolume');
    setVolume(api, defaultVolume ? defaultVolume : 0);
    setTime(api, this.documentVideoViewerService.getQueryParams('currentTime'));

    const defaultMedia = this.api.getDefaultMedia();
    const events = defaultMedia.subscriptions;

    events.volumeChange.subscribe((res) => {
      const presentVolume = res.target.volume;
      setVolume(api, presentVolume);
      this.documentVideoViewerService.setCookie('defaultVolume', presentVolume.toString(), 3600, '/', undefined, true, 'Lax');
    });

    events.playing.subscribe(() => {
      this.documentVideoViewerService.triggerEvent(new DocumentVideoEvent({ name: 'videoPlaying', currentTime: this.api.currentTime }));
    });

    events.pause.subscribe(() => {
      this.documentVideoViewerService.triggerEvent(new DocumentVideoEvent({ name: 'videoPause', currentTime: this.api.currentTime }));
    });

    if (this.autoPlay) {
      this.api.play();
    }

    function setVolume(vgApi: VgApiService, volume: any): void {
      if (volume) {
        vgApi.$$setAllProperties('volume', volume);
      }
    }

    function setTime(vgApi: VgApiService, time: any): void {
      if (time) {
        vgApi.$$setAllProperties('currentTime', time);
      }
    }
  }

}
