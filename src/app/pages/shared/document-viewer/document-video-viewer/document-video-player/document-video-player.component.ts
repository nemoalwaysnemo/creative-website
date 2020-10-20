import { Component, OnDestroy, Input, ChangeDetectionStrategy } from '@angular/core';
import { DocumentVideoViewerService, DocumentVideoEvent } from '../document-video-viewer.service';
import { DocumentVideoSettings } from './document-video-player.interface';
import { VgApiService } from '@videogular/ngx-videogular/core';
import { objHasValue } from '@core/services/helpers';
import { Subscription } from 'rxjs';

@Component({
  selector: 'document-video-player',
  styleUrls: ['./document-video-player.component.scss'],
  templateUrl: './document-video-player.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentVideoPlayerComponent implements OnDestroy {

  private subscription: Subscription = new Subscription();

  videoSettings: DocumentVideoSettings;

  @Input()
  set settings(settings: DocumentVideoSettings) {
    if (objHasValue(settings)) {
      this.videoSettings = settings;
    }
  }

  constructor(private documentVideoViewerService: DocumentVideoViewerService, private api: VgApiService) {
    const subscription = this.documentVideoViewerService.onEvent().subscribe((event: DocumentVideoEvent) => {
      if (event.name === 'currentTimeChanged') {
        this.api.currentTime = event.currentTime;
        this.api.play();
      }
    });
    this.subscription.add(subscription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onPlayerReady(api: VgApiService): void {
    this.api = api;
    if (this.videoSettings.enableGlobalMute) {
      const defaultVolume = this.documentVideoViewerService.getCookie('defaultVolume');
      setVolume(api, defaultVolume ? Number(defaultVolume) : 0);
    }

    setTime(api, this.documentVideoViewerService.getQueryParams('currentTime'));

    const defaultMedia = this.api.getDefaultMedia();
    const events = defaultMedia.subscriptions;

    const subscription1 = events.volumeChange.subscribe((res) => {
      if (this.videoSettings.enableGlobalMute) {
        const presentVolume = res.target.volume;
        setVolume(api, presentVolume);
        this.documentVideoViewerService.setCookie('defaultVolume', presentVolume.toString(), 3600, '/', undefined, true, 'Lax');
      }
    });
    this.subscription.add(subscription1);

    // const subscription2 = events.playing.subscribe(() => {
    //   this.documentVideoViewerService.triggerEvent(new DocumentVideoEvent({ name: 'videoPlaying', currentTime: api.currentTime, docUid: this.videoSettings.documentUid }));
    // });
    // this.subscription.add(subscription2);

    const subscription3 = events.pause.subscribe(() => {
      this.documentVideoViewerService.triggerEvent(new DocumentVideoEvent({ name: 'videoPause', currentTime: api.currentTime, docUid: this.videoSettings.docUid }));
    });
    this.subscription.add(subscription3);

    const subscription4 = events.seeking.subscribe(() => {
      this.documentVideoViewerService.triggerEvent(new DocumentVideoEvent({ name: 'videoSeeking', currentTime: api.currentTime, docUid: this.videoSettings.docUid }));
    });
    this.subscription.add(subscription4);

    const subscription5 = events.timeUpdate.subscribe(() => {
      this.documentVideoViewerService.triggerEvent(new DocumentVideoEvent({ name: 'videoTimeUpdate', currentTime: api.currentTime, docUid: this.videoSettings.docUid }));
    });
    this.subscription.add(subscription5);

    if (this.videoSettings.autoplay) {
      if (this.videoSettings.mute && !this.videoSettings.enableGlobalMute) {
        this.api.volume = 0;
      }
      this.api.play();
    }

    function setVolume(vgApi: VgApiService, volume: any): void {
      vgApi.$$setAllProperties('volume', volume);
    }

    function setTime(vgApi: VgApiService, time: any): void {
      if (time) {
        vgApi.$$setAllProperties('currentTime', time);
      }
    }
  }

}
