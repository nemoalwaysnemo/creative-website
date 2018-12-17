import { Component, OnInit } from '@angular/core';
import { PictureGalleryDataSource } from '@pages/shared/picture-gallery/picture-gallery-data-source.service';
import { NuxeoPagination, DocumentModel } from '@core/api';

@Component({
  selector: 'tbwa-home-gallery',
  styleUrls: ['./home-gallery.component.scss'],
  templateUrl: './home-gallery.component.html',
})
export class TbwaHomeGalleryComponent implements OnInit {

  private galleryItems: any;
  private gallerySettings: {};

  constructor(private pictureGalleryDataSource: PictureGalleryDataSource) {
  }
  agencyDocuments: DocumentModel[];
  ngOnInit() {
    this.galleryItems = [
      {
        src: 'https://preview.ibb.co/jrsA6R/img12.jpg',
        thumb: 'https://preview.ibb.co/jrsA6R/img12.jpg',
        title: 'edited title lalala ddddd blablablablablablablablablablablablablablablablablablablablablablablabla',
      },
      {
        src: 'https://library-na-dev.factory.tools/nuxeo/nxfile/default/33e9d23c-5e01-4d70-8431-3de41b461065/vid:transcodedVideos/0/content/dergeneral84.mp4',
        thumb: 'https://preview.ibb.co/jrsA6R/img12.jpg',
        poster: 'https://library-na-dev.factory.tools/nuxeo/nxpicsfile/default/33e9d23c-5e01-4d70-8431-3de41b461065/StaticPlayerView:content/1539967507000',
      },
      {
        src: 'https://preview.ibb.co/mwsA6R/img7.jpg',
        thumb: 'https://preview.ibb.co/mwsA6R/img7.jpg',
        title: 'pic 3 blablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablabla',
      },
    ];
    this.gallerySettings = {
      autoPlay: true,
      dots: true,
      loop: true,
    };
  }
}
