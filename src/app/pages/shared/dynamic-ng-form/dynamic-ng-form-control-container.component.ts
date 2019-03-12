import {
  Component,
  ComponentFactoryResolver,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DYNAMIC_FORM_CONTROL_TYPE_ARRAY,
  DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX,
  DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX_GROUP,
  DYNAMIC_FORM_CONTROL_TYPE_DATEPICKER,
  DYNAMIC_FORM_CONTROL_TYPE_GROUP,
  DYNAMIC_FORM_CONTROL_TYPE_INPUT,
  DYNAMIC_FORM_CONTROL_TYPE_RADIO_GROUP,
  DYNAMIC_FORM_CONTROL_TYPE_RATING,
  DYNAMIC_FORM_CONTROL_TYPE_SELECT,
  DYNAMIC_FORM_CONTROL_TYPE_TEXTAREA,
  DYNAMIC_FORM_CONTROL_TYPE_TIMEPICKER,
  DynamicDatePickerModel,
  DynamicFormArrayGroupModel,
  DynamicFormControl,
  DynamicFormControlContainerComponent,
  DynamicFormControlEvent,
  DynamicFormControlModel,
  DynamicFormInstancesService,
  DynamicFormLayout,
  DynamicFormLayoutService,
  DynamicFormValidationService,
  DynamicTemplateDirective,
  DYNAMIC_FORM_CONTROL_TYPE_SUGGESTION,
  DYNAMIC_FORM_CONTROL_TYPE_BATCH_UPLOAD,
} from '@core/custom';
import { DynamicNGCheckboxComponent } from './checkbox/dynamic-ng-checkbox.component';
import { DynamicNGCheckboxGroupComponent } from './checkbox-group/dynamic-ng-checkbox-group.component';
import { DynamicNGCalendarComponent } from './calendar/dynamic-ng-calendar.component';
import { DynamicNGDatePickerComponent } from './datepicker/dynamic-ng-datepicker.component';
import { DynamicNGFormArrayComponent } from './form-array/dynamic-ng-form-array.component';
import { DynamicNGFormGroupComponent } from './form-group/dynamic-ng-form-group.component';
import { DynamicNGInputComponent } from './input/dynamic-ng-input.component';
import { DynamicNGRadioGroupComponent } from './radio-group/dynamic-ng-radio-group.component';
import { DynamicNGRatingComponent } from './rating/dynamic-ng-rating.component';
import { DynamicNGSelectComponent } from './select/dynamic-ng-select.component';
import { DynamicNGTextAreaComponent } from './textarea/dynamic-ng-textarea.component';
import { DynamicNGTimePickerComponent } from './timepicker/dynamic-ng-timepicker.component';
import { DynamicNGBatchUploadComponent } from './batch-upload/dynamic-ng-batch-upload.component';
import { DynamicNGSuggestionComponent } from './suggestion/dynamic-ng-suggestion.component';

@Component({
  selector: 'dynamic-ng-form-control',
  templateUrl: './dynamic-ng-form-control-container.component.html',
})
export class DynamicNGFormControlContainerComponent extends DynamicFormControlContainerComponent {

  @ContentChildren(DynamicTemplateDirective) contentTemplateList: QueryList<DynamicTemplateDirective>;
  @Input('templates') inputTemplateList: QueryList<DynamicTemplateDirective>;

  @Input() asBootstrapFormGroup: boolean = true;
  @Input() context: DynamicFormArrayGroupModel | null = null;
  @Input() group: FormGroup;
  @Input() layout: DynamicFormLayout;
  @Input() model: DynamicFormControlModel;

  @Output() blur: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output() change: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output() focus: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output() customEvent: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();

  @ViewChild('componentViewContainer', { read: ViewContainerRef }) componentViewContainerRef: ViewContainerRef;

  constructor(protected componentFactoryResolver: ComponentFactoryResolver,
    protected layoutService: DynamicFormLayoutService,
    protected validationService: DynamicFormValidationService,
    protected dynamicFormInstancesService: DynamicFormInstancesService) {

    super(componentFactoryResolver, layoutService, validationService, dynamicFormInstancesService);
  }

  get componentType(): Type<DynamicFormControl> | null {
    return this.layoutService.getCustomComponentType(this.model) || ngBootstrapUIFormControlMapFn(this.model);
  }
}

export function ngBootstrapUIFormControlMapFn(model: DynamicFormControlModel): Type<DynamicFormControl> | null {

  switch (model.type) {

    case DYNAMIC_FORM_CONTROL_TYPE_ARRAY:
      return DynamicNGFormArrayComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX:
      return DynamicNGCheckboxComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX_GROUP:
      return DynamicNGCheckboxGroupComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_DATEPICKER:
      const datePickerModel = model as DynamicDatePickerModel;
      return datePickerModel.inline ? DynamicNGCalendarComponent : DynamicNGDatePickerComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_GROUP:
      return DynamicNGFormGroupComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_INPUT:
      return DynamicNGInputComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_RADIO_GROUP:
      return DynamicNGRadioGroupComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_RATING:
      return DynamicNGRatingComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_SELECT:
      return DynamicNGSelectComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_TEXTAREA:
      return DynamicNGTextAreaComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_TIMEPICKER:
      return DynamicNGTimePickerComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_SUGGESTION:
      return DynamicNGSuggestionComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_BATCH_UPLOAD:
      return DynamicNGBatchUploadComponent;

    default:
      return null;
  }
}
