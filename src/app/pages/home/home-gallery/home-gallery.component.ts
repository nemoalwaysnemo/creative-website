import { Component, OnInit } from '@angular/core';
import { NuxeoPagination, DocumentModel, BasePageProvider } from '@core/api';

@Component({
  selector: 'tbwa-home-gallery',
  styleUrls: ['./home-gallery.component.scss'],
  templateUrl: './home-gallery.component.html',
})
export class HomeGalleryComponent implements OnInit {

  private galleryItems: any;
  private gallerySettings: {};
  private defaultVideoFormats: string[] = ['MP4 480p'];

  agencyDocuments: DocumentModel[];

  constructor(private basePageProvider: BasePageProvider) {
  }

  ngOnInit() {
    const param = {
      pageSize: 10,
      currentPageIndex: 2,
    };
    this.basePageProvider.request(param).subscribe((res: NuxeoPagination) => {
      this.galleryItems = this.getItems(res.entries);
    });

    this.gallerySettings = {
      autoPlay: true,
      dots: true,
      loop: true,
      thumb: false,
    };
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

  hasVideoContent( entry: DocumentModel ) {
     if ( entry.getVideoSources(this.defaultVideoFormats).length > 0 ) {
       return true;
     }
   }
}
