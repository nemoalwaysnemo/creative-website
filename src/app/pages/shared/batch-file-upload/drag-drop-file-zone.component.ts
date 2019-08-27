import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DragDropFileZoneService } from './drag-drop-file-zone.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'drag-drop-file-zone',
  styleUrls: ['./batch-file-upload.component.scss'],
  templateUrl: './drag-drop-file-zone.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DragDropFileZoneComponent),
    multi: true,
  }],
})

export class DragDropFileZoneComponent implements OnInit, OnDestroy, ControlValueAccessor {

  files: File[] = [];

  disalbed: boolean = false;

  validComboDrag: boolean;

  disabled: boolean = false;

  private _onChange = (_) => { };

  private _onTouched = () => { };

  private subscription: Subscription = new Subscription();

  @Input() placeholder: string = 'Drop files here';

  @Input() acceptTypes: string = '*';

  @Input() uploadType: string;

  @Input() formMode: string;

  @Input() queueLimit: number = 1;

  @Input() maxSize: number = 1024 * 1024 * 1024 * 100; // 1024 == 1mb

  // @Output() fileChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(private dragDropFileZoneService: DragDropFileZoneService) {

  }

  ngOnInit(): void {
    this.subscription = this.dragDropFileZoneService.onStateChange().subscribe((x: any) => {
      this.disalbed = x.data;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  writeValue(value: any): void {
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

  onBlur(event: any): void {
    console.log(`BLUR event on ${event.model.id}: `, event);
  }

  onFocus(event: any): void {
    console.log(`FOCUS event on ${event.model.id}: `, event);
  }

  onFilesChange(files: File[]): void {
    this.dragDropFileZoneService.changeFiles(this.uploadType, files, this.queueLimit, this.formMode);
  }

}
