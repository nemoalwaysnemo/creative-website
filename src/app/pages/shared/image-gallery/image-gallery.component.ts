import { Component } from '@angular/core';
import { NgxGalleryOptions, NgxGalleryImage } from '@core/custom/ngx-gallery';
import { ImageGalleryDataSource } from './image-gallery-data-source.service';
import { NuxeoPagination, DocumentModel } from '@core/api';

@Component({
  selector: 'tbwa-image-gallery',
  styleUrls: ['./image-gallery.component.scss'],
  template: `<ngx-gallery [options]="galleryOptions" [images]="galleryImages"></ngx-gallery>`,
})
export class ImageGalleryComponent {

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private imageGalleryDataSource: ImageGalleryDataSource) {
    const params = {
      pageSize: 10,
    };
    this.galleryOptions = [
      {
        width: '600px',
        height: '400px',
        thumbnails: false,
        preview: false,
        imageDescription: true,
        imageAutoPlay: true,
        imageAutoPlayInterval: 3000,
      },
    ];
    this.imageGalleryDataSource.request(params).subscribe((res: NuxeoPagination) => {
      this.galleryImages = this.getImages(res.entries);
    });
  }

  private getImages(entiries: DocumentModel[]) {
    const imgArray = new Array();
    for (const entry of entiries) {
      imgArray.push({ small: entry.thumbnailUrl, medium: entry.thumbnailUrl, big: entry.thumbnailUrl });
    }
    return imgArray;
  }
}
