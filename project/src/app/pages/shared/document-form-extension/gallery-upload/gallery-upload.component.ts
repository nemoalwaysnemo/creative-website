import { Component, Input, forwardRef, OnDestroy, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DragScrollComponent } from 'ngx-drag-scroll';
import { isValueEmpty } from '@core/services/helpers';
import { BehaviorSubject, combineLatest, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, mergeMap } from 'rxjs/operators';
import { BatchUpload, NuxeoApiService, NuxeoBlob, NuxeoUploadResponse } from '@core/api';
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
      this.galleryUploadSettings$.next(settings);
    }
  }

  @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() onUpload: EventEmitter<{ type: string, response: NuxeoUploadResponse[] }> = new EventEmitter<{ type: string, response: NuxeoUploadResponse[] }>();

  uploadStatus$: BehaviorSubject<GalleryUploadStatus> = new BehaviorSubject<GalleryUploadStatus>(new GalleryUploadStatus());

  uploadSettings: GalleryUploadSettings = new GalleryUploadSettings();

  uploadItems: NuxeoUploadResponse[] = [];

  private galleryUploadSettings$: Subject<GalleryUploadSettings> = new Subject<GalleryUploadSettings>();

  private imageItems$: Subject<GalleryImageItem[]> = new Subject<GalleryImageItem[]>();

  private blobs$: Subject<NuxeoBlob> = new Subject<NuxeoBlob>();

  private subscription: Subscription = new Subscription();

  private selectedItems: number[] = [];

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
    if (!isValueEmpty(images) && images.some((x: any) => !(x instanceof NuxeoUploadResponse))) {
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
    if (!this.uploadStatus$.value.uploaded) {
      if (!item.selected) {
        item.selected = !item.selected;
        this.selectedItems.push(index);
        const removed = this.selectedItems.splice(0, this.selectedItems.length - this.uploadSettings.queueLimit).shift();
        if (removed !== undefined) {
          this.uploadItems[removed].item.selected = false;
        }
      } else if (item.selected) {
        item.selected = !item.selected;
        this.selectedItems.splice(this.selectedItems.indexOf(index), 1);
      }
      this.valid.emit(this.selectedItems.length === 0);
      this.updateUploadStatus({ selected: this.selectedItems.length > 0 });
    }
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

  onPaste(e: ClipboardEvent): void {
    if (this.uploadSettings.enableClipboard) {
      this.imageItems$.next(this.getClipboardImages(e));
    }
  }

  private getClipboardImages(event: ClipboardEvent): GalleryImageItem[] {
    const files: GalleryImageItem[] = [];
    const items: FileList = event.clipboardData.files;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.includes('image')) {
        files.push(new GalleryImageItem(items[i]));
      }
    }
    return files;
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
      this.galleryUploadSettings$,
    ]).pipe(
      distinctUntilChanged(),
      debounceTime(300),
    ).subscribe(([items, settings]: [GalleryImageItem[], GalleryUploadSettings]) => {
      this.uploadSettings = settings;
      this.uploadItems = this.buildGalleryImageItem(items, settings).concat(this.uploadItems);
      this.updateUploadStatus({ itemChanged: true });
      this.emitUploadResponse('FileChanged', this.uploadItems);
    });
    this.subscription.add(subscription);
  }

  private upload(files: NuxeoUploadResponse[]): void {
    files.filter((res: NuxeoUploadResponse) => !res.uploaded && !res.original).forEach((res: NuxeoUploadResponse, index: number) => { res.fileIdx = index; res.blob.fileIdx = index; res.item.uploading = true; this.blobs$.next(res.blob); });
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
    this.emitUploadResponse('UploadChanged', this.uploadItems);
    this.valid.emit(uploaded);
  }

  private getSelectedFiles(): NuxeoUploadResponse[] {
    return this.selectedItems.map((index: number) => this.uploadItems[index]);
  }

  emitUploadResponse(type: string, response: NuxeoUploadResponse[]): void {
    this._onChange(response);
    this.onUpload.emit({ type, response });
  }

  private buildGalleryImageItem(images: any[], settings: GalleryUploadSettings): NuxeoUploadResponse[] {
    return (images || []).map((x: any) => {
      const item = x instanceof GalleryImageItem ? x : new GalleryImageItem(x);
      return new NuxeoUploadResponse({ blob: new NuxeoBlob({ content: item.getFile(), xpath: settings.xpath, label: settings.label, original: settings.original, isFileList: settings.isFileList, formMode: settings.formMode }), item });
    });
  }

}
