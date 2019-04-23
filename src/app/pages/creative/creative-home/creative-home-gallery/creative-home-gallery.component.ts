import { Component, OnInit, OnDestroy } from '@angular/core';
import { NuxeoPagination, DocumentModel, AdvanceSearch } from '@core/api';
import { NUXEO_META_INFO } from '@environment/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'creative-home-gallery',
  styleUrls: ['./creative-home-gallery.component.scss'],
  templateUrl: './creative-home-gallery.component.html',
})
export class CreativeHomeGalleryComponent implements OnInit, OnDestroy {

  galleryItems: any = [];
  gallerySettings: any = {
    playerInterval: 5000,
    autoPlay: true,
    dots: true,
    dotsSize: 20,
    loop: true,
    thumb: false,
  };

  private params: any = {
    pageSize: 10,
    ecm_path: NUXEO_META_INFO.CREATIVE_AWARD_FOLDER_PATH,
    ecm_primaryType: NUXEO_META_INFO.CREATIVE_IMAGE_VIDEO_TYPES,
  };

  agencyDocuments: DocumentModel[];

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

  private getItems(entiries: DocumentModel[]) {
    const imgArray = new Array();
    for (const entry of entiries) {
      if (entry.isVideo() && this.hasVideoContent(entry)) {
        imgArray.push({ src: entry.getVideoSources(), thumb: entry.thumbnailUrl, poster: entry.videoPoster, title: entry.title, uid: entry.uid});
      } else if (entry.isPicture()) {
        const url = entry.thumbnailUrl;
        imgArray.push({ src: url, thumb: url, title: entry.title, uid: entry.uid });
      } else {
      }
    }
    return imgArray;
  }

  hasVideoContent(entry: DocumentModel) {
    return entry.getVideoSources().length > 0;
  }
}
