import { Component, OnInit } from '@angular/core';
import { NuxeoPagination, DocumentModel, AdvanceSearch } from '@core/api';
import { NUXEO_META_INFO } from '@environment/environment';

@Component({
  selector: 'tbwa-home-gallery',
  styleUrls: ['./home-gallery.component.scss'],
  templateUrl: './home-gallery.component.html',
})
export class HomeGalleryComponent implements OnInit {

  galleryItems: any = [];
  gallerySettings: any = {
    autoPlay: true,
    dots: true,
    dotsSize: 20,
    loop: true,
    thumb: false,
  };

  private params: any = {
    pageSize: 10,
    ecm_path: NUXEO_META_INFO.AWARD_FOLDER_PATH,
  };

  private defaultVideoFormats: string[] = ['MP4 480p'];

  agencyDocuments: DocumentModel[];

  constructor(private advanceSearch: AdvanceSearch) {
  }

  ngOnInit() {
    this.advanceSearch.request(this.params).subscribe((res: NuxeoPagination) => {
      this.galleryItems = this.getItems(res.entries);
    });
  }

  private getItems(entiries: DocumentModel[]) {
    const imgArray = new Array();
    for (const entry of entiries) {
      if (entry.isVideo() && this.hasVideoContent(entry)) {
        imgArray.push({ src: entry.getVideoSources(this.defaultVideoFormats)[0]['src'], thumb: entry.thumbnailUrl, poster: entry.getVideoPoster() });
      } else if (entry.isPicture()) {
        const url = entry.thumbnailUrl;
        imgArray.push({ src: url, thumb: url });
      } else {
      }
    }
    return imgArray;
  }

  hasVideoContent(entry: DocumentModel) {
    if (entry.getVideoSources(this.defaultVideoFormats).length > 0) {
      return true;
    }
  }
}
