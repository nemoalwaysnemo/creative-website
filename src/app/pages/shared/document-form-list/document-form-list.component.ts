import { Component, forwardRef, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormGroup, FormArray } from '@angular/forms';
import { DocumentModel } from '@core/api';
import { Subscription, Subject } from 'rxjs';
import {
  DynamicFormControlModel,
  DynamicFormModel,
  DynamicFormService,
  DynamicFormComponent,
  DynamicFormControlEvent,
  DynamicFormArrayModel,
  DynamicFormComponentService,
} from '../../../core/custom/ng-dynamic-forms';

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

  @Input() modelId: string;

  @Input() loading: boolean = true;

  @Input() settings: DynamicFormModel = [];

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.formMode = doc.uid ? 'edit' : 'create';
      this.document$.next(doc);
    }
  }

  @Output() blur: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();

  @Output() change: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();

  @Output() focus: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();

  @Output() customEvent: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();

  formGroup: FormGroup;

  formGroupModels: DynamicFormModel = [];

  private formArrayModel: DynamicFormArrayModel;

  private formMode: 'create' | 'edit';

  private disabled: boolean = false;

  private _onChange = (_) => { };

  private _onTouched = () => { };

  private documentModel: DocumentModel;

  protected subscription: Subscription = new Subscription();

  private document$: Subject<DocumentModel> = new Subject<DocumentModel>();

  constructor(protected formService: DynamicFormService, protected changeDetectorRef: ChangeDetectorRef, protected componentService: DynamicFormComponentService) {
    super(changeDetectorRef, componentService);
    this.onDocumentChanged();
  }


  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  writeValue(val: any): void {
    console.log(9999, this.formGroup.value);
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
    const list = this.formGroup.controls[this.modelId] as FormArray;
    this.formService.addFormArrayGroup(list, this.formArrayModel);
    console.log(4444, this.formGroupModels, this.formGroup.value);
  }

  getColumns(): number {
    return this.settings.length + 1;
  }

  private getFormArrayModel(settings: DynamicFormModel): DynamicFormArrayModel {
    return this.formArrayModel || (this.formArrayModel = new DynamicFormArrayModel({
      id: this.modelId,
      groupFactory: () => settings,
    }));
  }

  private onDocumentChanged(): void {
    const subscription = this.document$.pipe(
    ).subscribe((doc: DocumentModel) => {
      this.loading = false;
      this.documentModel = doc;
      const settings = this.performSettings(doc, this.settings);
      this.formGroupModels = this.formService.fromJSON([this.getFormArrayModel(settings)]);
      this.formGroup = this.formService.createFormGroup(this.formGroupModels);
    });
    this.subscription.add(subscription);
  }

  private createForm(settings: DynamicFormModel): FormGroup {
    const model = this.formService.fromJSON(settings);
    return this.formService.createFormGroup(model);
  }

  private performSettings(doc: DocumentModel, settings: DynamicFormModel): DynamicFormModel {
    let formModel = settings.filter((v) => v.formMode === null || v.formMode === this.formMode);
    if (doc) {
      formModel = formModel.filter((m: DynamicFormControlModel) => !m.visibleFn || m.visibleFn.call(this, doc));
      formModel.forEach((model: DynamicFormControlModel) => {
        const modelValue = doc.get(model.id);
        if (model.hiddenFn) { model.hidden = model.hiddenFn.call(this, doc); }
        if (model.document) { model.document = doc; }
        model.value = (!!model.defaultValue && !modelValue) ? model.defaultValue : modelValue;
      });
    }
    return formModel;
  }

}
