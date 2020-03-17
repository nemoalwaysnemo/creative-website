import { Component, OnDestroy, Input, ChangeDetectionStrategy } from '@angular/core';
import { DocumentVideoViewerService } from '../document-video-viewer.service';
import { VgAPI } from 'videogular2/compiled/core';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from '@core/services';
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

  constructor(private seekTimeService: DocumentVideoViewerService,
              private cookieService: CookieService,
              private activatedRoute: ActivatedRoute,
              private api: VgAPI) {
    this.subscription = this.seekTimeService.getTimeChanged().subscribe(
      res => {
        this.api.currentTime = res.time;
        this.api.play();
      },
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onPlayerReady(api: VgAPI) {
    this.api = api;
    const defaultVolume = this.cookieService.get('defaultVolume');
    defaultVolume ? setVolume(defaultVolume) : setVolume(0);

    const currentTime = this.activatedRoute.snapshot.queryParams['currentTime'];
    currentTime ? setTime(currentTime) : '';

    const defaultMedia = this.api.getDefaultMedia();
    defaultMedia.subscriptions.volumeChange.subscribe(
      (res) => {
        const presentVolume = res.target.volume;
        setVolume(presentVolume);
        this.cookieService.set('defaultVolume', presentVolume.toString(), 3600, '/', undefined, true, 'None');
      });
    if (this.autoPlay) {
      this.api.play();
    }

    function setVolume(volume) {
      api.$$setAllProperties('volume', volume);
    }

    function setTime(time: number) {
      api.$$setAllProperties('currentTime', time);
    }
  }

}
