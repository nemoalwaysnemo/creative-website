import { Component, Input, forwardRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DragScrollComponent } from 'ngx-drag-scroll';
import { isValueEmpty } from '@core/services/helpers';
import { combineLatest, Subject, Subscription } from 'rxjs';
import { GalleryImageItem, GalleryUploadSettings } from './gallery-upload.interface';
import { debounceTime } from 'rxjs/operators';

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
      this.settings$.next(settings);
    }
  }

  images: GalleryImageItem[] = [];

  gallerySettings: GalleryUploadSettings = new GalleryUploadSettings();

  protected settings$: Subject<GalleryUploadSettings> = new Subject<GalleryUploadSettings>();

  protected pictures$: Subject<GalleryImageItem[]> = new Subject<GalleryImageItem[]>();

  private subscription: Subscription = new Subscription();

  private disabled: boolean = false;

  private _onChange = (_) => { };

  private _onTouched = () => { };

  constructor() {
    this.onPicturesChanged();
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  writeValue(pictures: any): void {
    if (pictures) {
      this.pictures$.next(this.buildGalleryImageItem(pictures));
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
    console.log('item clicked', item);
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

  protected onPicturesChanged(): void {
    const subscription = combineLatest([
      this.settings$,
      this.pictures$,
    ]).pipe(
      debounceTime(100),
    ).subscribe(([settings, pictures]: [GalleryUploadSettings, GalleryImageItem[]]) => {
      this.images = pictures;
      this.gallerySettings = settings;
    });
    this.subscription.add(subscription);
  }

  private buildGalleryImageItem(images: any[]): GalleryImageItem[] {
    return (images || []).map((x: any) => new GalleryImageItem(x));
  }

}
