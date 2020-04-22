import { Component, OnInit, OnDestroy } from '@angular/core';
import { NuxeoPagination, DocumentModel, AdvanceSearch } from '@core/api';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { Subscription } from 'rxjs';

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
    ecm_primaryType: NUXEO_META_INFO.BACKSLASH_ARTICLE_VIDEO_TYPES,
  };

  private subscription: Subscription = new Subscription();

  constructor(private advanceSearch: AdvanceSearch) {
  }

  ngOnInit() {
    this.subscription = this.advanceSearch.request(this.params).subscribe((res: NuxeoPagination) => {
      this.galleryItems = this.getItems(res.entries);
    });
  }

  ngOnDestroy() {
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
    const imgArray = new Array();
    for (const entry of entiries) {
      if (entry.isVideo() && this.hasVideoContent(entry)) {
        imgArray.push({ src: entry.getCarouselVideoSources(), thumb: entry.attachedImage, poster: entry.attachedImage, title: entry.title, uid: entry.uid, description: entry.get('dc:description'), doc: entry });
      } else if (entry.isPicture()) {
        const url = entry.attachedImage;
        imgArray.push({ src: url, thumb: url, title: entry.title, uid: entry.uid, description: entry.get('dc:description'), doc: entry });
      } else {
      }
    }
    return imgArray;
  }

  hasVideoContent(entry: DocumentModel): boolean {
    return entry.getVideoSources().length > 0;
  }

  toggleInfo(doc: DocumentModel): void {
    this.showInfo = !this.showInfo;
    this.onStatusChanged();
    this.toggleStatus();
    this.document = doc;
  }

}
