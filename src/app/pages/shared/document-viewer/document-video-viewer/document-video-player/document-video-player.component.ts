import { Component, OnDestroy, Input, ChangeDetectionStrategy } from '@angular/core';
import { DocumentVideoViewerService } from '../document-video-viewer.service';
import { Subscription } from 'rxjs/Subscription';
import { VgAPI } from 'videogular2/core';

@Component({
  selector: 'tbwa-document-video-player',
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

  constructor(private seekTimeService: DocumentVideoViewerService, api: VgAPI) {
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
    if (this.autoPlay) {
      this.api.play();
    }
  }
}
