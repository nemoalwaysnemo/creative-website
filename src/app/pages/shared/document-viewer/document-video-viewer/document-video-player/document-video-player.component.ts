import { Component, OnDestroy, Input, ChangeDetectionStrategy } from '@angular/core';
import { DocumentVideoViewerService } from '../document-video-viewer.service';
import { Subscription } from 'rxjs/Subscription';
import { VgAPI } from 'videogular2/compiled/core';
import { Observable, Subject } from 'rxjs';
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

  $muteToggle = new Subject();

  unmutedMode: boolean = false;

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
    const defaultMedia = this.api.getDefaultMedia();

    this.unmutedMode = (this.cookieService.get('unmutedMode') === 'true');
    this.api.$$setAllProperties('volume', +this.unmutedMode);

    if (this.autoPlay) {
      this.api.play();
    }

    this.$muteToggle.subscribe((res: boolean) => {
      this.cookieService.set('unmutedMode', res && 'true', 0);
      this.api.$$setAllProperties('volume', +res);
    });
  }

  switchSoundMode() {
    this.unmutedMode = !this.unmutedMode;
    this.$muteToggle.next(this.unmutedMode);
  }
}
