import { Component, Input, forwardRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DragScrollComponent } from 'ngx-drag-scroll';
import { BatchUpload, NuxeoApiService } from '@core/api';
import { isValueEmpty } from '@core/services/helpers';
import { GalleryImageItem, GalleryUploadSettings } from './gallery-upload.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'gallery-upload',
  templateUrl: 'gallery-upload.component.html',
  styleUrls: ['gallery-upload.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => GalleryUploadComponent),
    multi: true,
  }],
})
export class GalleryUploadComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @ViewChild('gallery', { static: true, read: DragScrollComponent }) gallery: DragScrollComponent;

  @Input()
  set settings(settings: GalleryUploadSettings) {
    if (!isValueEmpty(settings)) {
      this.gallerySettings = settings;
    }
  }

  images: GalleryImageItem[];

  gallerySettings: GalleryUploadSettings = new GalleryUploadSettings();

  private subscription: Subscription = new Subscription();

  private batchUpload: BatchUpload;

  private disabled: boolean = false;

  private _onChange = (_) => { };

  private _onTouched = () => { };

  constructor(private nuxeoApi: NuxeoApiService, private sanitizer: DomSanitizer) {
    this.batchUpload = this.nuxeoApi.batchUpload();
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  writeValue(images: any): void {
    if (images) {
      this.images = this.buildGalleryImageItem(images);
    }
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  clickItem(item: GalleryImageItem): void {
    item.selected = !item.selected;
    console.log('item clicked', item);
  }

  getSafeImagePath(src: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(src);
  }

  moveLeft(): void {
    this.gallery.moveLeft();
  }

  moveRight(): void {
    this.gallery.moveRight();
  }

  leftBoundStat(reachesLeftBound: boolean): void {
    // console.log('reachesLeftBound');
  }

  rightBoundStat(reachesRightBound: boolean): void {
    // console.log('rightBoundStat');
  }

  onSnapAnimationFinished(): void {
    // console.log('snap animation finished');
  }

  onIndexChanged(idx): void {
    console.log('current index: ' + idx);
  }

  onDragScrollInitialized(): void {
    // console.log('first demo drag scroll has been initialized.');
  }

  onDragStart(): void {
    // console.log('drag start');
  }

  onDragEnd(): void {
    // console.log('drag end');
  }

  private buildGalleryImageItem(images: any[]): GalleryImageItem[] {
    return (images || []).map((x: any) => new GalleryImageItem(x));
  }

}
