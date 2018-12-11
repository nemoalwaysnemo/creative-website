import { Component} from '@angular/core';
import { NgxGalleryOptions, NgxGalleryImage } from '@core/custom/ngx-gallery';
import { ImageGalleryDataSource } from './image-gallery-data-source.service';
@Component({
  selector: 'tbwa-image-gallery',
  styleUrls: ['./image-gallery.component.scss'],
  template: `<ngx-gallery [options]="galleryOptions" [images]="galleryImages"></ngx-gallery>`,
})
export class ImageGalleryComponent {
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  constructor(private imageGalleryDataSource: ImageGalleryDataSource ) {
    const params = {
      currentPageIndex: 1,
      pageSize: 10,
    };
    this.galleryOptions = [
      {
        width: '600px',
        height: '400px',
        thumbnailsColumns: 4,
      },
    ];
    this.imageGalleryDataSource.search(params);
    this.imageGalleryDataSource.onSearch().subscribe(res => {
      this.galleryImages = this.getImages(res.entries);
    });
  }


  private getImages(entiries: any = {}) {
    const imgArray = new Array;
    Object.keys(entiries).forEach(function (key) {
      const thumbnailUrl = entiries[key]._contextParameters.thumbnail.url;
      const imgSetting = { small: thumbnailUrl, medium: thumbnailUrl, big: thumbnailUrl };
      imgArray.push(imgSetting) ;
      });
    return imgArray;
  }
}
