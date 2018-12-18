import { Component, Inject, AfterViewInit, Input, OnInit } from '@angular/core';
import { Gallery, GalleryConfig, GalleryRef, GalleryItem, GALLERY_CONFIG, ImageItem, ThumbnailsPosition, ImageSize } from '@ngx-gallery/core';
import { Observable, Observer, Subject, BehaviorSubject } from 'rxjs';
import { deepExtend } from '@core/api';
@Component({
  selector: 'tbwa-picture-gallery',
  styleUrls: ['./picture-gallery.component.scss'],
  templateUrl: './picture-gallery.component.html',
})
export class PictureGalleryComponent implements OnInit, AfterViewInit {
  @Input() gallerySettings: GalleryConfig;

  options$: BehaviorSubject<GalleryItem[]> = new BehaviorSubject([]);

  @Input('galleryItems')
  set setItems(galleryItems: []) {
    if (galleryItems) {
      this.options$.next(galleryItems);
    }
  }

  private galleryRef: GalleryRef;
  private galleryId = 'pictureGallery';

  constructor(private gallery: Gallery, @Inject(GALLERY_CONFIG) private options) {
    this.galleryRef = this.gallery.ref(this.galleryId);
  }

  ngOnInit() {
    this.options$.subscribe((res: GalleryItem[]) => {
      res.forEach((galleryItem: {}) => {
        if (galleryItem['poster']) {
          this.galleryRef.addVideo(galleryItem);
        } else {
          this.galleryRef.addImage(galleryItem);
        }
    });
  });
  }

  ngAfterViewInit() {
    if (this.gallerySettings) {
      const config = deepExtend(this.options, this.gallerySettings);
      this.galleryRef.setConfig(config);
    }
  }
}
