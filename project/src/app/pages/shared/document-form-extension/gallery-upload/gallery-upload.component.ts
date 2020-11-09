import { Component, Input, forwardRef, OnDestroy, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BatchUpload, NuxeoApiService, NuxeoBlob, NuxeoUploadResponse } from '@core/api';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DragScrollComponent } from 'ngx-drag-scroll';
import { isValueEmpty } from '@core/services/helpers';
import { BehaviorSubject, combineLatest, Subject, Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { GalleryImageItem, GalleryUploadSettings, GalleryUploadStatus } from './gallery-upload.interface';

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
      this.gallerySettings$.next(settings);
    }
  }

  @Output() onUpload: EventEmitter<NuxeoUploadResponse[]> = new EventEmitter<NuxeoUploadResponse[]>();

  uploadStatus$: BehaviorSubject<GalleryUploadStatus> = new BehaviorSubject<GalleryUploadStatus>(new GalleryUploadStatus());

  gallerySettings: GalleryUploadSettings = new GalleryUploadSettings();

  uploadItems: NuxeoUploadResponse[] = [];

  private gallerySettings$: Subject<GalleryUploadSettings> = new Subject<GalleryUploadSettings>();

  private imageItems$: Subject<GalleryImageItem[]> = new Subject<GalleryImageItem[]>();

  private blobs$: Subject<NuxeoBlob> = new Subject<NuxeoBlob>();

  private subscription: Subscription = new Subscription();

  private selectedItems: Set<number> = new Set<number>();

  private batchUpload: BatchUpload;

  private disabled: boolean = false;

  private _onChange = (_) => { };

  private _onTouched = () => { };

  constructor(private nuxeoApi: NuxeoApiService, private sanitizer: DomSanitizer) {
    this.batchUpload = this.nuxeoApi.batchUpload();
    this.onFilesChanged();
    this.onUploadFiles();
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  writeValue(images: any): void {
    if (images) {
      this.imageItems$.next(images);
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

  clickItem(index: number, item: GalleryImageItem): void {
    if (!item.selected && this.selectedItems.size < this.gallerySettings.queueLimit) {
      item.selected = !item.selected;
      this.selectedItems.add(index);
    } else if (item.selected) {
      item.selected = !item.selected;
      this.selectedItems.delete(index);
    }
    this.updateUploadStatus({ selected: this.selectedItems.size > 0 });
  }

  uploadFiles(): void {
    this.updateUploadStatus({ uploaded: false, uploading: true });
    this.upload(this.getSelectedFiles());
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

  private onUploadFiles(): void {
    const subscription = this.blobs$.pipe(
      mergeMap((blob: NuxeoBlob) => this.batchUpload.upload(blob)),
    ).subscribe((res: NuxeoUploadResponse) => {
      this.updateFileResponse(res);
    });
    this.subscription.add(subscription);
  }

  private onFilesChanged(): void {
    const subscription = combineLatest([
      this.imageItems$,
      this.gallerySettings$,
    ]).subscribe(([items, settings]: [GalleryImageItem[], GalleryUploadSettings]) => {
      this.gallerySettings = settings;
      this.uploadItems = this.buildGalleryImageItem(items, settings);
    });
    this.subscription.add(subscription);
  }

  private upload(files: NuxeoUploadResponse[]): void {
    files.filter((res: NuxeoUploadResponse) => !res.uploaded).forEach((res: NuxeoUploadResponse, index: number) => { res.fileIdx = index; res.blob.fileIdx = index; res.item.uploading = true; this.blobs$.next(res.blob); });
  }

  private updateUploadStatus(status: any = {}): void {
    this.uploadStatus$.next(this.uploadStatus$.value.update(status));
  }

  private updateFileResponse(response: NuxeoUploadResponse): void {
    const list = Array.from(this.selectedItems);
    const index = list[response.fileIdx];
    const item = this.uploadItems[index].item;
    item.uploading = !response.uploaded;
    item.uploaded = response.uploaded;
    response.item = item;
    this.uploadItems[index] = response;
    const uploadItems = this.uploadItems.filter((res: NuxeoUploadResponse) => res.item.uploading || res.item.uploaded);
    const uploaded = uploadItems.every((res: NuxeoUploadResponse) => res.uploaded);
    this.updateUploadStatus({ uploaded, uploading: !uploaded });
    this.triggerEvent(uploadItems);
  }

  private getSelectedFiles(): NuxeoUploadResponse[] {
    const items = [];
    for (const index of this.selectedItems) {
      items.push(this.uploadItems[index]);
    }
    return items;
  }

  triggerEvent(files: NuxeoUploadResponse[]): void {
    this.onUpload.emit(files);
    this._onChange(files);
  }

  private buildGalleryImageItem(images: any[], settings: GalleryUploadSettings): NuxeoUploadResponse[] {
    return (images || []).map((x: any) => {
      const item = new GalleryImageItem(x);
      return new NuxeoUploadResponse({ blob: new NuxeoBlob({ content: item.getFile(), uploadFileType: settings.uploadType, formMode: settings.formMode }), item });
    });
  }

}
