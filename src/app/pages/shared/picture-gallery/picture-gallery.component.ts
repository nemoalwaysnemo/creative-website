import { Component, Inject, AfterViewInit, Input, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Gallery, GalleryConfig, GalleryRef, GalleryItem, GALLERY_CONFIG } from '@core/custom/ngx-gallery/core/index';
import { BehaviorSubject, Subscription } from 'rxjs';
import { deepExtend } from '@core/services';

@Component({
  selector: 'picture-gallery',
  styleUrls: ['./picture-gallery.component.scss'],
  templateUrl: './picture-gallery.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PictureGalleryComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() assetUrl: string;

  @Input() gallerySettings: GalleryConfig;

  @Input('galleryItems')
  set setItems(galleryItems: GalleryItem[]) {
    if (galleryItems) {
      this.options$.next(galleryItems);
    }
  }

  private galleryId = 'pictureGallery';

  private galleryRef: GalleryRef;

  private subscription: Subscription = new Subscription();

  private options$: BehaviorSubject<GalleryItem[]> = new BehaviorSubject([]);

  constructor(private gallery: Gallery, @Inject(GALLERY_CONFIG) private options) {
    this.galleryRef = this.gallery.ref(this.galleryId);
  }

  ngOnInit() {
    const subscription = this.options$.subscribe((res: GalleryItem[]) => {
      res.forEach((galleryItem: {}) => {
        if (galleryItem['poster']) {
          this.galleryRef.addVideo(galleryItem);
        } else {
          this.galleryRef.addImage(galleryItem);
        }
      });
      this.galleryRef.play();
    });
    this.subscription.add(subscription);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit() {
    if (this.gallerySettings) {
      const config = deepExtend(this.options, this.gallerySettings);
      this.galleryRef.setConfig(config);
    }
  }
}
