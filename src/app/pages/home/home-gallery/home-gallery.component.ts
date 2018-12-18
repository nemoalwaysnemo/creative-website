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
    };
  }

  private getItems(entiries: DocumentModel[]) {
    const imgArray = new Array();
    for (const entry of entiries) {
      if (entry.isVideo()) {
        imgArray.push({ src: entry.getVideoSources['src'], thumb: entry.thumbnailUrl, poster: entry.getVideoPoster });
      } else if (entry.isPicture()) {
        imgArray.push({ src: entry.thumbnailUrl, thumb: entry.thumbnailUrl, title: '12345'});
      } else {
      }
    }
    return imgArray;
  }

}
