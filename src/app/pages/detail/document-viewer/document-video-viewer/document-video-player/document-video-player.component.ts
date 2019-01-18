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

  private seekTimeServiceRef: Subscription;

  @Input() poster: string;

  @Input() videoSources: object;

  constructor(private seekTimeService: DocumentVideoViewerService, api: VgAPI) {
    this.seekTimeServiceRef = this.seekTimeService.getTimeChanged().subscribe(
      res => {
        this.api.currentTime = res.time;
        this.api.play();
      },
    );
  }

  ngOnDestroy() {
    this.seekTimeServiceRef.unsubscribe();
  }

  onPlayerReady(api: VgAPI) {
    this.api = api;
  }
}
