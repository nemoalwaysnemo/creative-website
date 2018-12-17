import { Component, Inject, AfterViewInit} from '@angular/core';
import { PictureGalleryDataSource } from './picture-gallery-data-source.service';
import { NuxeoPagination, DocumentModel } from '@core/api';
import { Gallery, GalleryConfig, GalleryRef, GalleryItem, GALLERY_CONFIG, ImageItem, ThumbnailsPosition, ImageSize } from '@ngx-gallery/core';
@Component({
  selector: 'tbwa-picture-gallery',
  styleUrls: ['./picture-gallery.component.scss'],
  templateUrl: './picture-gallery.component.html',
})
export class PictureGalleryComponent implements AfterViewInit {
  items: GalleryItem[];
  private galleryId = 'mixedExample';
  private galleryRef: GalleryRef;
  private config: GalleryConfig = {
    dots: true,
    autoPlay: true,
  };
  constructor(private gallery: Gallery) {
    this.galleryRef = this.gallery.ref(this.galleryId);
    this.galleryRef.addImage({
      src: 'https://preview.ibb.co/jrsA6R/img12.jpg',
      thumb: 'https://preview.ibb.co/jrsA6R/img12.jpg',
      title: 'edited title lalala ddddd blablablablablablablablablablablablablablablablablablablablablablablabla',
    });

    this.galleryRef.addVideo({
      src: 'https://library-na-dev.factory.tools/nuxeo/nxfile/default/33e9d23c-5e01-4d70-8431-3de41b461065/vid:transcodedVideos/0/content/dergeneral84.mp4',
      thumb: 'https://preview.ibb.co/jrsA6R/img12.jpg',
      poster: 'https://library-na-dev.factory.tools/nuxeo/nxpicsfile/default/33e9d23c-5e01-4d70-8431-3de41b461065/StaticPlayerView:content/1539967507000',
    });

    this.galleryRef.addImage({
      src: 'https://preview.ibb.co/mwsA6R/img7.jpg',
      thumb: 'https://preview.ibb.co/mwsA6R/img7.jpg',
      title: 'pic 3 blablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablabla',
    });
  }

  ngAfterViewInit() {
    this.galleryRef.setConfig(this.config);
  }
}
