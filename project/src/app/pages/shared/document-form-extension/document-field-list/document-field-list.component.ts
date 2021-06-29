import { Component, forwardRef, Input, Output, EventEmitter, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormGroup, FormArray } from '@angular/forms';
import {
  DynamicFormModel,
  DynamicFormService,
  DynamicFormComponent,
  DynamicFormControlEvent,
  DynamicFormArrayModel,
  DynamicFormComponentService,
} from '@core/custom/ng-dynamic-forms';
import { isValueEmpty } from '@core/services/helpers';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DocumentFieldListSettings } from './document-field-list.interface';

@Component({
  selector: 'document-field-list',
  styleUrls: ['./document-field-list.component.scss'],
  templateUrl: './document-field-list.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DocumentFieldListComponent),
    multi: true,
  }],
})
export class DocumentFieldListComponent extends DynamicFormComponent implements OnInit, OnDestroy, ControlValueAccessor {

  constructor(protected formService: DynamicFormService, protected changeDetectorRef: ChangeDetectorRef, protected componentService: DynamicFormComponentService) {
    super(changeDetectorRef, componentService);
  }

  @Input() modelId: string;

  @Input() loading: boolean = true;

  @Input()
  set settings(settings: DocumentFieldListSettings) {
    if (!isValueEmpty(settings)) {
      this.formListSettings = settings;
    }
  }

  @Output() blur: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();

  @Output() change: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();

  @Output() focus: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();

  @Output() customEvent: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();

  formGroup: FormGroup;

  formArrayModel: DynamicFormArrayModel;

  disabled: boolean = false;

  private formListSettings: DocumentFieldListSettings = new DocumentFieldListSettings();

  private subscription: Subscription = new Subscription();

  private _onChange = (_) => { };

  private _onTouched = () => { };

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  writeValue(values: any[]): void {
    this.createForm(this.formListSettings, values);
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

  onAddRow(): void {
    const formArrayControl = this.formService.findControlByModel<FormArray>(this.formArrayModel, this.formGroup);
    this.formService.addFormArrayGroup(formArrayControl, this.formArrayModel);
    this.formService.detectChanges();
  }

  getColumns(): number {
    return this.formListSettings.items.length + 1;
  }

  private getFormArrayModel(items: DynamicFormModel, rows: number = 1): DynamicFormArrayModel {
    return this.formArrayModel || (this.formArrayModel = new DynamicFormArrayModel({
      id: this.modelId,
      initialCount: rows,
      groupFactory: () => items,
    }));
  }

  private createForm(settings: DocumentFieldListSettings, values: any[] = []): void {
    const rows = values && values.length > 0 ? values.length : 0;
    const models = [this.getFormArrayModel(settings.items, rows)];
    const formGroupModels = this.formService.fromJSON(models);
    this.formGroup = this.formService.createFormGroup(formGroupModels);
    if (rows > 0) {
      const formArray = (this.formGroup.get(this.modelId) as FormArray);
      let v = values;
      if (settings.subPathKey) {
        v = values.map(x => { const list = {}; list[settings.subPathKey] = x; return list; });
      }
      formArray.patchValue(v, { onlySelf: true, emitEvent: false });
    }
    this.subscription = this.formGroup.get(this.modelId).valueChanges.pipe(debounceTime(300)).subscribe(val => {
      if (settings.subPathKey) {
        this._onChange(val.map(x => x[settings.subPathKey]));
      } else {
        this._onChange(val);
      }
    });
  }

}
