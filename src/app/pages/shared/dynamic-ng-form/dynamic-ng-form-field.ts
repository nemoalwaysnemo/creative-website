import { Type } from '@angular/core';
import {
  DynamicFormControl,
  DynamicDatePickerModel,
  DynamicFormControlModel,
  // DYNAMIC_FORM_CONTROL_TYPE_ARRAY,
  DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX,
  DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX_GROUP,
  DYNAMIC_FORM_CONTROL_TYPE_DATEPICKER,
  // DYNAMIC_FORM_CONTROL_TYPE_GROUP,
  DYNAMIC_FORM_CONTROL_TYPE_INPUT,
  DYNAMIC_FORM_CONTROL_TYPE_RADIO_GROUP,
  DYNAMIC_FORM_CONTROL_TYPE_RATING,
  DYNAMIC_FORM_CONTROL_TYPE_SELECT,
  DYNAMIC_FORM_CONTROL_TYPE_TEXTAREA,
  DYNAMIC_FORM_CONTROL_TYPE_TIMEPICKER,
  DYNAMIC_FORM_CONTROL_TYPE_SUGGESTION,
  DYNAMIC_FORM_CONTROL_TYPE_BATCH_UPLOAD,
  DYNAMIC_FORM_CONTROL_TYPE_OPTION_TAG,
  DYNAMIC_FORM_CONTROL_TYPE_DATEPICKER_DIRECTIVE,
  DYNAMIC_FORM_CONTROL_TYPE_DRAG_GROP_FILE_ZONE,
  DYNAMIC_FORM_CONTROL_TYPE_LIST,
} from '@core/custom';
import { DynamicNGCheckboxComponent } from './checkbox/dynamic-ng-checkbox.component';
import { DynamicNGCheckboxGroupComponent } from './checkbox-group/dynamic-ng-checkbox-group.component';
import { DynamicNGCalendarComponent } from './calendar/dynamic-ng-calendar.component';
import { DynamicNGDatePickerComponent } from './datepicker/dynamic-ng-datepicker.component';
// import { DynamicNGFormArrayComponent } from './form-array/dynamic-ng-form-array.component';
// import { DynamicNGFormGroupComponent } from './form-group/dynamic-ng-form-group.component';
import { DynamicNGInputComponent } from './input/dynamic-ng-input.component';
import { DynamicNGRadioGroupComponent } from './radio-group/dynamic-ng-radio-group.component';
import { DynamicNGRatingComponent } from './rating/dynamic-ng-rating.component';
import { DynamicNGSelectComponent } from './select/dynamic-ng-select.component';
import { DynamicNGTextAreaComponent } from './textarea/dynamic-ng-textarea.component';
import { DynamicNGTimePickerComponent } from './timepicker/dynamic-ng-timepicker.component';
import { DynamicNGBatchUploadComponent } from './batch-upload/dynamic-ng-batch-upload.component';
import { DynamicNGSuggestionComponent } from './suggestion/dynamic-ng-suggestion.component';
import { DynamicNGOptionTagComponent } from './option-tag/dynamic-ng-option-tag.component';
import { DynamicNGDatepickerDirectiveComponent } from './datepicker-directive/dynamic-ng-datepicker-directive.component';
import { DynamicNGDragDropFileZoneComponent } from './drag-drop-file-zone/dynamic-ng-drag-drop-file-zone.component';
import { DynamicNGListComponent } from './list/dynamic-ng-list.component';

export function ngBootstrapUIFormControlMapFn(model: DynamicFormControlModel): Type<DynamicFormControl> | null {
  switch (model.type) {
    // case DYNAMIC_FORM_CONTROL_TYPE_ARRAY:
      // return DynamicNGFormArrayComponent;
    case DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX:
      return DynamicNGCheckboxComponent;
    case DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX_GROUP:
      return DynamicNGCheckboxGroupComponent;
    case DYNAMIC_FORM_CONTROL_TYPE_DATEPICKER:
      const datePickerModel = model as DynamicDatePickerModel;
      return datePickerModel.inline ? DynamicNGCalendarComponent : DynamicNGDatePickerComponent;
    // case DYNAMIC_FORM_CONTROL_TYPE_GROUP:
      // return DynamicNGFormGroupComponent;
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
    case DYNAMIC_FORM_CONTROL_TYPE_OPTION_TAG:
      return DynamicNGOptionTagComponent;
    case DYNAMIC_FORM_CONTROL_TYPE_DATEPICKER_DIRECTIVE:
      return DynamicNGDatepickerDirectiveComponent;
    case DYNAMIC_FORM_CONTROL_TYPE_DRAG_GROP_FILE_ZONE:
      return DynamicNGDragDropFileZoneComponent;
    case DYNAMIC_FORM_CONTROL_TYPE_LIST:
      return DynamicNGListComponent;
    default:
      return null;
  }
}
