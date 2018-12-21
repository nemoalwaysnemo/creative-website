import { Component, OnInit } from '@angular/core';
import { NuxeoPagination, DocumentModel, BasePageProvider } from '@core/api';
import { NUXEO_META_INFO } from '@environment/environment';

@Component({
  selector: 'tbwa-home-gallery',
  styleUrls: ['./home-gallery.component.scss'],
  templateUrl: './home-gallery.component.html',
})
export class HomeGalleryComponent implements OnInit {

  private galleryItems: any;
  private gallerySettings: any = {
    autoPlay: true,
    dots: true,
    loop: true,
    thumb: false,
  };

  private params: any = {
    pageSize: 10,
    ecm_path: NUXEO_META_INFO.AWARD_FOLDER_PATH,
  };

  private defaultVideoFormats: string[] = ['MP4 480p'];

  agencyDocuments: DocumentModel[];

  constructor(private basePageProvider: BasePageProvider) {
  }

  ngOnInit() {
    this.basePageProvider.request(this.params).subscribe((res: NuxeoPagination) => {
      this.galleryItems = this.getItems(res.entries);
    });
  }

  private getItems(entiries: DocumentModel[]) {
    const imgArray = new Array();
    for (const entry of entiries) {
      if (entry.isVideo() && this.hasVideoContent(entry)) {
        imgArray.push({ src: entry.getVideoSources(this.defaultVideoFormats)[0]['src'], thumb: entry.thumbnailUrl, poster: entry.getVideoPoster });
      } else if (entry.isPicture()) {
        const url = entry.thumbnailUrl;
        imgArray.push({ src: url, thumb: url, title: '12345' });
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
