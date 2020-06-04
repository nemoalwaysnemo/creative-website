import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NuxeoPagination, DocumentModel } from '@core/api';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';
import { DocumentPageService } from '@pages/shared';

@Component({
  selector: 'backslash-home-gallery',
  styleUrls: ['./backslash-home-gallery.component.scss'],
  templateUrl: './backslash-home-gallery.component.html',
})
export class BackslashHomeGalleryComponent implements OnInit, OnDestroy {

  galleryEvent: string = 'play';

  status: string = 'closed';

  showInfo: boolean = false;

  playStatus: boolean = false;

  document: DocumentModel;

  galleryItems: any = [];

  gallerySettings: any = {
    playerInterval: 5000,
    autoPlay: true,
    dots: true,
    dotsSize: 10,
    loop: true,
    thumb: false,
  };

  private params: any = {
    pageSize: 8,
    app_edges_active_article: true,
    ecm_path: NUXEO_PATH_INFO.BACKSLASH_BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_ARTICLE_VIDEO_TYPES,
  };

  private subscription: Subscription = new Subscription();

  constructor(private documentPageService: DocumentPageService) {
  }

  ngOnInit(): void {
    this.subscription = this.documentPageService.advanceRequest(this.params).subscribe((res: NuxeoPagination) => {
      this.galleryItems = this.getItems(res.entries);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onPlayingChange(e: any): void {
    this.playStatus = (e && e.isPlaying === true) ? false : true;
    this.showInfo = this.showInfo && this.playStatus;
    this.onStatusChanged();
    this.toggleStatus();
  }

  onStatusChanged(): void {
    this.galleryEvent = this.showInfo === true ? 'stop' : 'play';
  }

  toggleStatus(): void {
    this.status = this.showInfo === true ? 'opened' : 'closed';
  }

  private getItems(entiries: DocumentModel[]): any[] {
    const data = new Array();
    for (const doc of entiries) {
      if (doc.isVideo() && this.hasVideoContent(doc)) {
        data.push({ src: doc.getCarouselVideoSources(), thumb: doc.thumbnailUrl, poster: doc.videoPoster, title: doc.title, uid: doc.uid, description: doc.get('dc:description'), doc });
      } else if (doc.isPicture()) {
        const url = doc.attachedImage;
        data.push({ src: url, thumb: url, title: doc.title, uid: doc.uid, description: doc.get('dc:description'), doc });
      } else {
      }
    }
    return data;
  }

  hasVideoContent(doc: DocumentModel): boolean {
    return doc.getVideoSources().length > 0;
  }

  toggleInfo(doc: DocumentModel): void {
    this.showInfo = !this.showInfo;
    this.onStatusChanged();
    this.toggleStatus();
    this.document = doc;
    if (this.showInfo) {
      this.documentPageService.googleAnalyticsTrackEvent({
        'event_category': 'Gallery',
        'event_action': `Gallery Item Preview`,
        'event_label': `Gallery Item Preview - ${doc.title}`,
        'event_value': doc.uid,
        'dimensions.docId': doc.uid,
        'dimensions.docTitle': doc.title,
      });
    }
  }

}
