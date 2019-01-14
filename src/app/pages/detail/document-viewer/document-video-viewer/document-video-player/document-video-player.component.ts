import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { VgAPI } from 'videogular2/core';
import { DocumentVideoViewerService } from '../document-video-viewer.service';
import { Subscription } from 'rxjs/Subscription';
@Component({
  selector: 'tbwa-document-video-player',
  styleUrls: ['./document-video-player.component.scss'],
  templateUrl: './document-video-player.component.html',
})
export class DocumentVideoPlayerComponent implements OnInit {
  @Input() filePath: string;
  @Input() poster: string;
  @Input() videoSources: object;
  api: VgAPI;
  subscription: Subscription;
  constructor( private seekTimeService: DocumentVideoViewerService, api: VgAPI ) {
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
