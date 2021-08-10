import { Directive, EventEmitter, ElementRef, Input, Output, HostListener, OnDestroy, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { createInvisibleFileInputWrap, isFileInput, detectSwipe } from './helpers';
import { acceptType, InvalidFileItem, dataUrl } from './file-tools';
import { NgFileEvent, NgFileService } from './ng-file.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[ngFile]',
})
export class NgFileDirective implements OnInit, OnDestroy, OnChanges {

  protected fileElm: any;

  protected filters: { name: string; fn: (file: File) => boolean }[] = [];

  protected lastFileCount: number = 0;

  @Input() multiple: string;
  @Input() accept: string;
  @Input() maxSize: number;
  @Input() queueLimit: number;

  @Input() fileDropDisabled: boolean = false;
  @Input() selectable: boolean = false;
  // @Output() onInit: EventEmitter<any> = new EventEmitter<any>();

  @Input() lastInvalids: InvalidFileItem[] = [];
  @Output() lastInvalidsChange: EventEmitter<{ file: File; type: string }[]> = new EventEmitter();

  @Input() lastBaseUrl: string; // base64 last file uploaded url
  @Output() lastBaseUrlChange: EventEmitter<string> = new EventEmitter();

  @Input() file: File; // last file uploaded
  @Output() fileChange: EventEmitter<File> = new EventEmitter();

  @Input() files: File[] = [];
  @Output() filesChange: EventEmitter<File[]> = new EventEmitter<File[]>();

  private subscription: Subscription = new Subscription();

  constructor(protected element: ElementRef, protected ngFileService: NgFileService) {
    this.subscribeEvents();
    this.initFilters();
  }

  initFilters(): void {
    // the order is important
    this.filters.push({ name: 'accept', fn: this._acceptFilter });
    this.filters.push({ name: 'fileSize', fn: this._fileSizeFilter });

    // this.filters.push({name: 'fileType', fn: this._fileTypeFilter})
    // this.filters.push({name: 'queueLimit', fn: this._queueLimitFilter})
    // this.filters.push({name: 'mimeType', fn: this._mimeTypeFilter})
  }

  ngOnDestroy(): void {
    delete this.fileElm; // faster memory release of dom element
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    if (this.selectable) {
      this.enableSelecting();
    }

    if (this.multiple) {
      this.paramFileElm().setAttribute('multiple', this.multiple);
    }

    // create reference to this class with one cycle delay to avoid ExpressionChangedAfterItHasBeenCheckedError
    // setTimeout(() => {
    //   this.onInit.emit(this);
    // }, 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.accept) {
      this.paramFileElm().setAttribute('accept', changes.accept.currentValue || '*');
    }
  }

  paramFileElm(): any {
    if (this.fileElm) { return this.fileElm; } // already defined

    // elm is a file input
    const isFile = isFileInput(this.element.nativeElement);
    if (isFile) { return this.fileElm = this.element.nativeElement; }

    // create foo file input
    const label = createInvisibleFileInputWrap();
    this.fileElm = label.getElementsByTagName('input')[0];
    this.fileElm.addEventListener('change', this.changeFn.bind(this));
    this.element.nativeElement.appendChild(label);
    return this.fileElm;
  }

  enableSelecting(): void {
    const elm = this.element.nativeElement;

    if (isFileInput(elm)) {
      const bindedHandler = ev => this.beforeSelect();
      elm.addEventListener('click', bindedHandler);
      elm.addEventListener('touchstart', bindedHandler);
    } else {
      const bindedHandler = ev => this.clickHandler(ev);
      elm.addEventListener('click', bindedHandler);
      elm.addEventListener('touchstart', bindedHandler);
      elm.addEventListener('touchend', bindedHandler);
    }
  }

  getValidFiles(files: File[]): File[] {
    const rtn: File[] = [];
    for (let x = files.length - 1; x >= 0; --x) {
      if (this.isFileValid(files[x])) {
        rtn.push(files[x]);
      }
    }
    return rtn;
  }

  getInvalidFiles(files: File[]): InvalidFileItem[] {
    const rtn: InvalidFileItem[] = [];
    for (let x = files.length - 1; x >= 0; --x) {
      const failReason = this.getFileFilterFailName(files[x]);
      if (failReason) {
        rtn.push({
          file: files[x],
          type: failReason,
        });
      }
    }
    return rtn;
  }

  handleFiles(files: File[]): void {
    const valids = this.getValidFiles(files);

    if (files.length !== valids.length) {
      this.lastInvalids = this.getInvalidFiles(files);
    } else {
      delete this.lastInvalids;
    }

    this.lastInvalidsChange.emit(this.lastInvalids);

    if (valids.length) {
      if (this.queueLimit && this.queueLimit > 0) {
        valids.splice(this.queueLimit, valids.length);
      }
      this.que(valids);
    }

    if (this.isEmptyAfterSelection()) {
      this.element.nativeElement.value = '';
    }
  }

  que(files: File[]): void {
    this.files = this.files || [];
    Array.prototype.push.apply(this.files, files);
    this.files = this.distinctFiles(this.files, 'name');
    // below break memory ref and doesnt act like a que
    // this.files = files//causes memory change which triggers bindings like <ngfFormData [files]="files"></ngfFormData>

    // this.filesChange.emit(this.files);
    this.filesChange.emit(files);

    if (files.length) {
      this.fileChange.emit(this.file = files[0]);

      if (this.lastBaseUrlChange.observers.length) {
        dataUrl(files[0]).then(url => this.lastBaseUrlChange.emit(url));
      }
    }

    // will be checked for input value clearing
    this.lastFileCount = this.files.length;
  }

  /** called when input has files */
  changeFn(event: any): void {
    const fileList = event.__files_ || (event.target && event.target.files);

    if (!fileList) { return; }

    this.stopEvent(event);
    this.handleFiles(fileList);
  }

  clickHandler(evt: any): boolean {
    const elm = this.element.nativeElement;
    if (elm.getAttribute('disabled') || this.fileDropDisabled) {
      return false;
    }

    const r = detectSwipe(evt);
    // prevent the click if it is a swipe
    if (r !== false) { return r; }

    const fileElm = this.paramFileElm();
    fileElm.click();
    // fileElm.dispatchEvent( new Event('click') );
    this.beforeSelect();

    return false;
  }

  beforeSelect(): void {
    if (this.files && this.lastFileCount === this.files.length) { return; }

    // if no files in array, be sure browser doesnt prevent reselect of same file (see github issue 27)
    this.fileElm.value = null;
  }

  isEmptyAfterSelection(): boolean {
    return !!this.element.nativeElement.attributes.multiple;
  }

  eventToTransfer(event: any): any {
    if (event.dataTransfer) { return event.dataTransfer; }
    return event.originalEvent ? event.originalEvent.dataTransfer : null;
  }

  stopEvent(event: any): any {
    event.preventDefault();
    event.stopPropagation();
  }

  transferHasFiles(transfer: any): any {
    if (!transfer.types) {
      return false;
    }

    if (transfer.types.indexOf) {
      return transfer.types.indexOf('Files') !== -1;
    } else if (transfer.types.contains) {
      return transfer.types.contains('Files');
    } else {
      return false;
    }
  }

  eventToFiles(event: Event): any[] {
    const transfer = this.eventToTransfer(event);
    if (transfer) {
      if (transfer.files && transfer.files.length) {
        return transfer.files;
      }
      if (transfer.items && transfer.items.length) {
        return transfer.items;
      }
    }
    return [];
  }

  @HostListener('change', ['$event'])
  onChange(event: Event): void {
    const files = this.element.nativeElement.files || this.eventToFiles(event);

    if (!files.length) { return; }

    this.stopEvent(event);
    this.handleFiles(files);
  }

  getFileFilterFailName(file: File): string | undefined {

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < this.filters.length; i++) {
      if (!this.filters[i].fn.call(this, file)) {
        return this.filters[i].name;
      }
    }
    return undefined;
  }

  isFileValid(file: File): boolean {
    const noFilters = !this.accept && (!this.filters || !this.filters.length);
    if (noFilters) {
      return true; // we have no filters so all files are valid
    }

    return this.getFileFilterFailName(file) ? false : true;
  }

  isFilesValid(files: File[]): boolean {
    for (let x = files.length - 1; x >= 0; --x) {
      if (!this.isFileValid(files[x])) {
        return false;
      }
    }
    return true;
  }

  protected distinctFiles(files: File[], prop: string): File[] {
    return files.map(e => e[prop]).map((e, i, final) => final.indexOf(e) === i && i).filter(e => files[e]).map(e => files[e]);
  }

  protected _acceptFilter(item: File): boolean {
    return acceptType(this.accept, item.type, item.name);
  }

  /*protected _queueLimitFilter():boolean {
    return this.queueLimit === undefined || this.files.length < this.queueLimit
  }*/

  protected _fileSizeFilter(item: File): boolean {
    return !(this.maxSize && item.size > this.maxSize);
  }

  protected subscribeEvents(): void {
    const subscription = this.ngFileService.onEventType('ng-file').subscribe((event: NgFileEvent) => {
      if (event.name === 'openSelectWindow') {
        this.clickHandler(event.data.event);
      }
    });
    this.subscription.add(subscription);
  }

  /*protected _fileTypeFilter(item:File):boolean {
    return !(this.allowedFileType &&
    this.allowedFileType.indexOf(FileType.getMimeClass(item)) === -1)
  }*/

  /*protected _mimeTypeFilter(item:File):boolean {
    return !(this.allowedMimeType && this.allowedMimeType.indexOf(item.type) === -1);
  }*/
}
