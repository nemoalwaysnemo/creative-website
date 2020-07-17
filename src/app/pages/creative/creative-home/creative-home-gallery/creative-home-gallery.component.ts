import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NuxeoPagination, DocumentModel } from '@core/api';
import { parseCountry, assetPath } from '@core/services/helpers';
import { DocumentPageService, PictureGallerySettings } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'creative-home-gallery',
  styleUrls: ['./creative-home-gallery.component.scss'],
  templateUrl: './creative-home-gallery.component.html',
})
export class CreativeHomeGalleryComponent implements OnInit, OnDestroy {

  galleryItems: any[] = [];

  gallerySettings: PictureGallerySettings = new PictureGallerySettings({
    assetUrl: '/p/creative/asset/:uid',
    enableTitle: true,
  });

  galleryEvent: string = 'play';

  status: string = 'closed';

  showInfo: boolean = false;

  document: DocumentModel;

  currentUrl: string;

  private params: any = {
    pageSize: 10,
    ecm_path: NUXEO_PATH_INFO.CREATIVE_AWARD_FOLDER_PATH,
    ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_TYPES,
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
        items.push({ src: doc.getCarouselVideoSources(), thumb: doc.attachedImage, poster: doc.attachedImage, title: doc.title, uid: doc.uid, description: doc.get('dc:description'), doc });
      } else if (doc.isPicture()) {
        const url = doc.attachedImage;
        items.push({ src: url, thumb: url, title: doc.title, uid: doc.uid, description: doc.get('dc:description'), doc });
      }
    }
    return items;
  }

  toggleInfo(doc: DocumentModel): void {
    this.showInfo = !this.showInfo;
    this.onStatusChanged();
    this.toggleStatus();
    this.document = doc;
    if (this.showInfo) {
      this.currentUrl = this.buildShareUrl(doc.uid);
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

  previewBtnImage(): string {
    return assetPath('assets/images/preview_logo.png');
  }

  parseCountry(list: string[]) {
    return parseCountry(list);
  }

  private buildShareUrl(uid: string): string {
    this.currentUrl = window.location.href;
    const shareUrl = '/asset/' + uid;
    return this.currentUrl.indexOf('/home') > 0 ? this.currentUrl.split('/home')[0] + shareUrl : this.currentUrl;
  }
}
