import { Component, OnDestroy, Input, ChangeDetectionStrategy } from '@angular/core';
import { DocumentVideoViewerService } from '../document-video-viewer.service';
import { Subscription } from 'rxjs/Subscription';
import { VgAPI } from 'videogular2/compiled/core';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'document-video-player',
  styleUrls: ['./document-video-player.component.scss'],
  templateUrl: './document-video-player.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentVideoPlayerComponent implements OnDestroy {

  private api: VgAPI;

  private subscription: Subscription = new Subscription();

  @Input() poster: string;

  @Input() videoSources: object;

  @Input() autoPlay: boolean;

  constructor(private seekTimeService: DocumentVideoViewerService,
              private cookieService: CookieService,
              protected activatedRoute: ActivatedRoute,
              api: VgAPI) {
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
        this.cookieService.set('defaultVolume', presentVolume.toString());
      });
    if (this.autoPlay) {
      this.api.play();
    }

    function setVolume(volume) {
      api.$$setAllProperties('volume', volume);
    }

    function setTime(time) {
      api.$$setAllProperties('currentTime', time);
    }
  }

}
