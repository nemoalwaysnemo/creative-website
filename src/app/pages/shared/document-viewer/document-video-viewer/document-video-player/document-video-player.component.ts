import { Component, OnDestroy, Input, ChangeDetectionStrategy } from '@angular/core';
import { DocumentVideoViewerService, DocumentVideoEvent } from '../document-video-viewer.service';
import { VgAPI } from 'videogular2/compiled/core';
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

  constructor(private documentVideoViewerService: DocumentVideoViewerService, private api: VgAPI) {
    const subscription = this.documentVideoViewerService.onEvent('currentTimeChanged').subscribe((event: DocumentVideoEvent) => {
      this.api.currentTime = event.currentTime;
      this.api.play();
    });
    this.subscription.add(subscription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onPlayerReady(api: VgAPI) {
    this.api = api;
    const defaultVolume = this.documentVideoViewerService.getCookie('defaultVolume');
    setVolume(defaultVolume ? defaultVolume : 0);
    setTime(this.documentVideoViewerService.getQueryParams('currentTime'));

    const defaultMedia = this.api.getDefaultMedia();
    const events = defaultMedia.subscriptions;

    const subscription1 = events.volumeChange.subscribe((res) => {
      const presentVolume = res.target.volume;
      setVolume(presentVolume);
      this.documentVideoViewerService.setCookie('defaultVolume', presentVolume.toString(), 3600, '/', undefined, true, 'Lax');
    });
    this.subscription.add(subscription1);

    // const subscription2 = events.playing.subscribe(() => {
    //   this.documentVideoViewerService.triggerEvent(new DocumentVideoEvent({ name: 'videoPlaying', currentTime: api.currentTime }));
    // });
    // this.subscription.add(subscription2);

    const subscription3 = events.pause.subscribe(() => {
      this.documentVideoViewerService.triggerEvent(new DocumentVideoEvent({ name: 'videoPause', currentTime: api.currentTime }));
    });
    this.subscription.add(subscription3);

    const subscription4 = events.seeking.subscribe(() => {
      this.documentVideoViewerService.triggerEvent(new DocumentVideoEvent({ name: 'videoSeeking', currentTime: api.currentTime }));
    });
    this.subscription.add(subscription4);

    const subscription5 = events.timeUpdate.subscribe(() => {
      this.documentVideoViewerService.triggerEvent(new DocumentVideoEvent({ name: 'videoTimeUpdate', currentTime: api.currentTime }));
    });
    this.subscription.add(subscription5);

    if (this.autoPlay) {
      this.api.play();
    }

    function setVolume(volume: any): void {
      if (volume) {
        api.$$setAllProperties('volume', volume);
      }
    }

    function setTime(time: any): void {
      if (time) {
        api.$$setAllProperties('currentTime', time);
      }
    }
  }

}
