import { Component, OnInit, Input } from '@angular/core';
import { DocumentVideoViewerService } from '../document-video-viewer.service';
import { Subscription } from 'rxjs/Subscription';
import { VgAPI } from 'videogular2/core';

@Component({
  selector: 'tbwa-document-video-player',
  styleUrls: ['./document-video-player.component.scss'],
  templateUrl: './document-video-player.component.html',
})
export class DocumentVideoPlayerComponent implements OnInit {

  private api: VgAPI;

  private subscription: Subscription;

  @Input() poster: string;

  @Input() videoSources: object;

  constructor(private seekTimeService: DocumentVideoViewerService, api: VgAPI) {
    this.subscription = this.seekTimeService.getTimeChanged().subscribe(
      res => {
        this.api.currentTime = res.time;
        this.api.play();
      },
    );
  }
  ngOnInit() {
  }

  onPlayerReady(api: VgAPI) {
    this.api = api;
  }
}
