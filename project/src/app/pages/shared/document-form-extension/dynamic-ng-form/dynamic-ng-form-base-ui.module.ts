import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicFormsCoreModule } from '@core/custom';
import { TextMaskModule } from 'angular2-text-mask';
import { OptionTagModule } from '../option-tag/option-tag.module';
import { GalleryUploadModule } from '../gallery-upload/gallery-upload.module';
import { DatepickerDirectiveModule } from '../datepicker-directive/datepicker-directive.module';
import { DirectorySuggestionModule } from '../directory-suggestion/directory-suggestion.module';
import { DocumentFormListModule } from '../document-form-list/document-form-list.module';
import { NgbDatepickerModule, NgbButtonsModule, NgbTimepickerModule, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { DynamicNGFormControlContainerComponent } from './dynamic-ng-form-control-container.component';
import { DynamicNGFormComponent } from './dynamic-ng-form.component';
import { DynamicNGCalendarComponent } from './calendar/dynamic-ng-calendar.component';
import { DynamicNGCheckboxComponent } from './checkbox/dynamic-ng-checkbox.component';
import { DynamicNGCheckboxGroupComponent } from './checkbox-group/dynamic-ng-checkbox-group.component';
import { DynamicNGDatePickerComponent } from './datepicker/dynamic-ng-datepicker.component';
import { DynamicNGFormArrayComponent } from './form-array/dynamic-ng-form-array.component';
import { DynamicNGFormGroupComponent } from './form-group/dynamic-ng-form-group.component';
import { DynamicNGInputComponent } from './input/dynamic-ng-input.component';
import { DynamicNGListComponent } from './list/dynamic-ng-list.component';
import { DynamicNGRadioGroupComponent } from './radio-group/dynamic-ng-radio-group.component';
import { DynamicNGRatingComponent } from './rating/dynamic-ng-rating.component';
import { DynamicNGSelectComponent } from './select/dynamic-ng-select.component';
import { DynamicNGSwitchComponent } from './switch/dynamic-ng-switch.component';
import { DynamicNGTextAreaComponent } from './textarea/dynamic-ng-textarea.component';
import { DynamicNGTimePickerComponent } from './timepicker/dynamic-ng-timepicker.component';
import { DynamicNGSuggestionComponent } from './suggestion/dynamic-ng-suggestion.component';
import { DynamicNGGalleryUploadComponent } from './gallery-upload/dynamic-ng-gallery-upload.component';
import { DynamicNGOptionTagComponent } from './option-tag/dynamic-ng-option-tag.component';
import { DynamicNGFieldHeaderComponent } from './field-header/dynamic-ng-field-header.component';
import { DynamicNGDatepickerDirectiveComponent } from './datepicker-directive/dynamic-ng-datepicker-directive.component';
import { NbAccordionModule } from '@core/nebular/theme/components/accordion/accordion.module';
import { NbTabsetModule } from '@core/nebular/theme/components/tabset/tabset.module';

@NgModule({
  imports: [
    ReactiveFormsModule,
    NbAccordionModule,
    NbTabsetModule,
    CommonModule,
    NgbRatingModule,
    TextMaskModule,
    OptionTagModule,
    NgbButtonsModule,
    GalleryUploadModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    DocumentFormListModule,
    DirectorySuggestionModule,
    DatepickerDirectiveModule,
    DynamicFormsCoreModule,
  ],
  declarations: [
    DynamicNGSwitchComponent,
    DynamicNGCalendarComponent,
    DynamicNGCheckboxComponent,
    DynamicNGCheckboxGroupComponent,
    DynamicNGDatePickerComponent,
    DynamicNGFormArrayComponent,
    DynamicNGFormComponent,
    DynamicNGFormControlContainerComponent,
    DynamicNGFormGroupComponent,
    DynamicNGInputComponent,
    DynamicNGRadioGroupComponent,
    DynamicNGRatingComponent,
    DynamicNGSelectComponent,
    DynamicNGTextAreaComponent,
    DynamicNGTimePickerComponent,
    DynamicNGSuggestionComponent,
    DynamicNGListComponent,
    DynamicNGFieldHeaderComponent,
    DynamicNGOptionTagComponent,
    DynamicNGGalleryUploadComponent,
    DynamicNGDatepickerDirectiveComponent,
  ],
  exports: [
    DynamicFormsCoreModule,
    DynamicNGCalendarComponent,
    DynamicNGCheckboxComponent,
    DynamicNGCheckboxGroupComponent,
    DynamicNGDatePickerComponent,
    DynamicNGFormArrayComponent,
    DynamicNGFormComponent,
    DynamicNGFormControlContainerComponent,
    DynamicNGFormGroupComponent,
    DynamicNGInputComponent,
    DynamicNGRadioGroupComponent,
    DynamicNGRatingComponent,
    DynamicNGSelectComponent,
    DynamicNGTextAreaComponent,
    DynamicNGTimePickerComponent,
    DynamicNGSuggestionComponent,
    DynamicNGListComponent,
    DynamicNGOptionTagComponent,
    DynamicNGFieldHeaderComponent,
    DynamicNGGalleryUploadComponent,
    DynamicNGDatepickerDirectiveComponent,
  ],
})
export class DynamicFormsBaseNGUIModule {
}
