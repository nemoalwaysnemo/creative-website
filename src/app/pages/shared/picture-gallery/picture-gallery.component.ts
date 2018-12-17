import { Component, Inject, AfterViewInit, Input, OnInit } from '@angular/core';
import { Gallery, GalleryConfig, GalleryRef, GalleryItem, GALLERY_CONFIG, ImageItem, ThumbnailsPosition, ImageSize } from '@ngx-gallery/core';
import { deepExtend } from '@core/api';
@Component({
  selector: 'tbwa-picture-gallery',
  styleUrls: ['./picture-gallery.component.scss'],
  templateUrl: './picture-gallery.component.html',
})
export class PictureGalleryComponent implements OnInit, AfterViewInit {
  @Input() galleryItems: [];
  @Input() gallerySettings: GalleryConfig;

  private galleryRef: GalleryRef;
  private galleryId = 'pictureGallery';

  constructor(private gallery: Gallery, @Inject(GALLERY_CONFIG) private options) {
    this.galleryRef = this.gallery.ref(this.galleryId);
  }
  ngOnInit() {
    if (this.galleryItems) {
     this.galleryItems.forEach((galleryItem: {}) => {
        if ( galleryItem['poster']  ) {
          this.galleryRef.addVideo(galleryItem);
        } else {
          this.galleryRef.addImage(galleryItem);
        }
      });
    }
  }
  ngAfterViewInit() {
    if (this.gallerySettings) {
      const config = deepExtend(this.options, this.gallerySettings);
      this.galleryRef.setConfig(config);
    }
  }
}
