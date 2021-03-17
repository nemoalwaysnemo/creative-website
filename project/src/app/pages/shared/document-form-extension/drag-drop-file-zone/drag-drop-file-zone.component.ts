import { Component, OnInit, Input, OnDestroy, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DragDropFileZoneSettings } from './drag-drop-file-zone.interface';
import { DragDropFileZoneService } from './drag-drop-file-zone.service';
import { isValueEmpty } from '@core/services/helpers';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'drag-drop-file-zone',
  styleUrls: ['./drag-drop-file-zone.component.scss'],
  templateUrl: './drag-drop-file-zone.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DragDropFileZoneComponent),
    multi: true,
  }],
})

export class DragDropFileZoneComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Input()
  set settings(settings: DragDropFileZoneSettings) {
    if (!isValueEmpty(settings)) {
      this.uploadSettings = settings;
    }
  }

  files: File[] = [];

  disalbed: boolean = false;

  validComboDrag: boolean;

  disabled: boolean = false;

  uploadSettings: DragDropFileZoneSettings = new DragDropFileZoneSettings();

  private subscription: Subscription = new Subscription();

  private _onChange = (_) => { };

  private _onTouched = () => { };

  constructor(private dragDropFileZoneService: DragDropFileZoneService) {

  }

  ngOnInit(): void {
    this.subscription = this.dragDropFileZoneService.onStateChange().subscribe((x: any) => {
      this.disalbed = x.data;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  writeValue(value: any): void {
    if (!isValueEmpty(value)) {
      const files = Array.isArray(value) ? value : [value];
      const settings = Object.assign({}, this.uploadSettings, { original: true });
      timer(0).subscribe(() => { this.dragDropFileZoneService.changeFiles(settings, files); });
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

  onBlur(event: any): void {
    // console.log(`BLUR event on ${event.model.field}: `, event);
  }

  onFocus(event: any): void {
    // console.log(`FOCUS event on ${event.model.field}: `, event);
  }

  onFilesChange(files: File[]): void {
    this.dragDropFileZoneService.changeFiles(this.uploadSettings, files);
  }

}
