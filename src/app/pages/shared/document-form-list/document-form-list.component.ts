import { Component, forwardRef, Input, Output, EventEmitter, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormGroup, FormArray } from '@angular/forms';
import {
  DynamicFormModel,
  DynamicFormService,
  DynamicFormComponent,
  DynamicFormControlEvent,
  DynamicFormArrayModel,
  DynamicFormComponentService,
} from '../../../core/custom/ng-dynamic-forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'document-form-list',
  styleUrls: ['./document-form-list.component.scss'],
  templateUrl: './document-form-list.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DocumentFormListComponent),
    multi: true,
  }],
})
export class DocumentFormListComponent extends DynamicFormComponent implements OnInit, OnDestroy, ControlValueAccessor {

  constructor(protected formService: DynamicFormService, protected changeDetectorRef: ChangeDetectorRef, protected componentService: DynamicFormComponentService) {
    super(changeDetectorRef, componentService);
  }

  @Input() modelId: string;

  @Input() loading: boolean = true;

  @Input() settings: DynamicFormModel = [];

  @Output() blur: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();

  @Output() change: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();

  @Output() focus: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();

  @Output() customEvent: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();

  formGroup: FormGroup;

  formArrayModel: DynamicFormArrayModel;

  disabled: boolean = false;

  private subscription: Subscription = new Subscription();

  private _onChange = (_) => { };

  private _onTouched = () => { };

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  writeValue(values: any[]): void {
    this.createForm(this.settings, values);
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
    return this.settings.length + 1;
  }

  private getFormArrayModel(settings: DynamicFormModel, rows: number = 1): DynamicFormArrayModel {
    return this.formArrayModel || (this.formArrayModel = new DynamicFormArrayModel({
      id: this.modelId,
      initialCount: rows,
      groupFactory: () => settings,
    }));
  }

  private createForm(settings: DynamicFormModel, values: any[] = []): void {
    const rows = values && values.length > 0 ? values.length : 0;
    const models = [this.getFormArrayModel(settings, rows)];
    const formGroupModels = this.formService.fromJSON(models);
    this.formGroup = this.formService.createFormGroup(formGroupModels);
    if (rows > 0) { this.formGroup.get(this.modelId).patchValue(values, { onlySelf: true, emitEvent: false }); }
    this.subscription = this.formGroup.get(this.modelId).valueChanges.pipe(debounceTime(300)).subscribe(val => { this._onChange(val); });
  }

}
