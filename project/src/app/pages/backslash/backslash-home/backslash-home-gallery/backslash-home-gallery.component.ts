import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { NuxeoPagination, DocumentModel } from '@core/api';
import { DocumentPageService, PictureGallerySettings } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'backslash-home-gallery',
  styleUrls: ['./backslash-home-gallery.component.scss'],
  templateUrl: './backslash-home-gallery.component.html',
})
export class BackslashHomeGalleryComponent implements OnInit, OnDestroy {

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.gallerySettings.update({ enableVideoAutoplay: doc.get('app_global:carousel_autoplay') });
    }
  }

  galleryEvent: string = 'play';

  status: string = 'closed';

  showInfo: boolean = false;

  enableNewPoster: boolean = false;

  gallerySettings: PictureGallerySettings = new PictureGallerySettings({
    enableVideoAutoplay: true,
    assetUrl: '/p/backslash/asset/:uid',
  });

  selectedDocument: DocumentModel;

  galleryItems: any[] = [];

  private params: any = {
    pageSize: 8,
    app_edges_active_article: true,
    ecm_path: NUXEO_PATH_INFO.BACKSLASH_BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_ARTICLE_VIDEO_POST_TYPES,
  };

  private playStatus: boolean = false;

  private subscription: Subscription = new Subscription();

  constructor(private documentPageService: DocumentPageService) {
  }

  ngOnInit(): void {
    this.subscription = this.documentPageService.advanceRequest(this.params).subscribe((res: NuxeoPagination) => {
      this.galleryItems = this.convertItems(res.entries);
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

  private convertItems(entiries: DocumentModel[]): any[] {
    const items: any[] = [];
    for (const doc of entiries) {
      if (doc.isVideo() && doc.hasVideoContent()) {
        items.push({ src: doc.getCarouselVideoSources(), thumb: doc.thumbnailUrl, poster: doc.videoPoster, title: doc.title, uid: doc.uid, description: doc.get('dc:description'), doc });
      } else if (doc.isPicture()) {
        const url = doc.attachedImage;
        items.push({ src: url, thumb: url, title: doc.title, uid: doc.uid, description: doc.get('dc:description'), doc });
      }
    }
    return items;
  }

  toggleInfo(doc: DocumentModel): void {
    this.showInfo = !this.showInfo;
    this.selectedDocument = doc;
    this.onStatusChanged();
    this.toggleStatus();
    if (this.showInfo) {
      this.documentPageService.googleAnalyticsTrackEvent({
        event_category: 'Gallery',
        event_action: `Gallery Item Preview`,
        event_label: `Gallery Item Preview - ${doc.title}`,
        event_value: doc.uid,
        'dimensions.docId': doc.uid,
        'dimensions.docTitle': doc.title,
      });
    }
  }

}
