import { Component, OnDestroy, Input, ChangeDetectionStrategy } from '@angular/core';
import { DocumentVideoViewerService } from '../document-video-viewer.service';
import { Subscription } from 'rxjs/Subscription';
import { VgAPI } from 'videogular2/compiled/core';
import { CookieService } from 'ngx-cookie-service';
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

  constructor(private seekTimeService: DocumentVideoViewerService, api: VgAPI, private cookieService: CookieService) {
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
    const defaultVolumn = this.cookieService.get('defaultVolumn');
    defaultVolumn ? setVolumn(defaultVolumn) : setVolumn(0);

    const defaultMedia = this.api.getDefaultMedia();
    defaultMedia.subscriptions.volumeChange.subscribe(
      (res) => {
        const presentVolumn = res.target.volume;
        setVolumn(presentVolumn);
        this.cookieService.set('defaultVolumn', presentVolumn.toString());
      });
    if (this.autoPlay) {
      this.api.play();
    }

    function setVolumn(volume) {
      api.$$setAllProperties('volume', volume);
    }
  }

}
