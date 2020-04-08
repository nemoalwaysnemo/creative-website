import { Component, Inject, AfterViewInit, Input, OnInit, OnDestroy, ChangeDetectionStrategy, TemplateRef } from '@angular/core';
import { Gallery, GalleryConfig, GalleryRef, GalleryItem, GALLERY_CONFIG } from '@core/custom/ngx-gallery/core/index';
import { BehaviorSubject, Subscription } from 'rxjs';
import { deepExtend } from '@core/services';
import { Params } from '@angular/router';

@Component({
  selector: 'picture-gallery',
  styleUrls: ['./picture-gallery.component.scss'],
  templateUrl: './picture-gallery.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PictureGalleryComponent implements OnInit, OnDestroy, AfterViewInit {

  queryParams: Params[] = [];

  @Input() assetUrl: string;

  @Input() galleryType: string = 'creative';

  @Input() customTemplate: TemplateRef<any>;

  @Input() gallerySettings: GalleryConfig;

  @Input()
  set customEvent(name: string) {
    this.event$.next(name);
  }

  @Input('galleryItems')
  set setItems(galleryItems: GalleryItem[]) {
    if (galleryItems) {
      this.options$.next(galleryItems);
    }
  }

  galleryRef: GalleryRef;

  private galleryId = 'pictureGallery';

  private videoPlayers: HTMLMediaElement[] = [];

  private subscription: Subscription = new Subscription();

  private options$: BehaviorSubject<GalleryItem[]> = new BehaviorSubject([]);

  private event$: BehaviorSubject<string> = new BehaviorSubject<string>('play');

  constructor(private gallery: Gallery, @Inject(GALLERY_CONFIG) private options) {
    this.galleryRef = this.gallery.ref(this.galleryId);
  }

  ngOnInit() {
    this.subscribeEvents();
    this.subscribeOptions();
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

  onCustomEvent(e: any): void {
    const { itemIndex, event } = e;
    this.videoPlayers[itemIndex] = event.player;
  }

  onClick(i: number): void {
    if (this.videoPlayers[i]) {
      const currentTime = this.videoPlayers[i].currentTime;
      this.queryParams[i] = { currentTime };
    }
  }

  private subscribeEvents(): void {
    const subscription = this.event$.subscribe((event: string) => {
      switch (event) {
        case 'play':
          this.galleryRef.play();
          break;
        case 'stop':
          this.galleryRef.stop();
          break;
        default:
          this.galleryRef.play();
          break;
      }
    });
    this.subscription.add(subscription);
  }

  private subscribeOptions(): void {
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
}
