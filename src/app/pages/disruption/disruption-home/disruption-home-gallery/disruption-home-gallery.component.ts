import { Component, OnInit, OnDestroy } from '@angular/core';
import { NuxeoPagination, DocumentModel, AdvanceSearch } from '@core/api';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'disruption-home-gallery',
  styleUrls: ['./disruption-home-gallery.component.scss'],
  templateUrl: './disruption-home-gallery.component.html',
})
export class DisruptionHomeGalleryComponent implements OnInit, OnDestroy {

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
    pageSize: 10,
    ecm_path: NUXEO_PATH_INFO.DISRUPTION_AWARD_FOLDER_PATH,
    ecm_primaryType: NUXEO_META_INFO.DISRUPTION_AWARDs_ASSET_TYPE,
  };

  private gallerySwitch: any = {
    pageSize: 10,
    ecm_path: NUXEO_PATH_INFO.DISRUPTION_AWARD_FOLDER_PATH,
    ecm_primaryType: NUXEO_META_INFO.DISRUPTION_AWARDs_FOLDER_TYPE,
  };

  private showGallery: boolean = true;
  agencyDocuments: DocumentModel[];

  private subscription: Subscription = new Subscription();

  constructor(private advanceSearch: AdvanceSearch) {
  }

  ngOnInit() {
    this.subscription = this.advanceSearch.request(this.params).subscribe((res: NuxeoPagination) => {
      this.galleryItems = this.getItems(res.entries);
    });
    this.advanceSearch.request(this.gallerySwitch).subscribe((res: NuxeoPagination) => {
      this.showGallery = res.entries[0].get('app_global:enable_carousel');
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private getItems(entiries: DocumentModel[]) {
    const imgArray = new Array();
    for (const entry of entiries) {
      if (entry.isVideo() && this.hasVideoContent(entry)) {
        imgArray.push({ src: entry.getVideoSources(), thumb: entry.attachedImage, poster: entry.attachedImage, title: entry.title, uid: entry.uid, description: entry.get('dc:description'), outerLink: entry.get('app_Edges:URL') });
      } else if (entry.isPicture()) {
        const url = entry.attachedImage;
        imgArray.push({ src: url, thumb: url, title: entry.title, uid: entry.uid, description: entry.get('dc:description'), outerLink: entry.get('app_Edges:URL') });
      } else {
      }
    }
    return imgArray;
  }

  hasVideoContent(entry: DocumentModel) {
    return entry.getVideoSources().length > 0;
  }
}
