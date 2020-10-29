import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbDatepicker, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import {
  DynamicDatePickerModel,
  DynamicFormControlCustomEvent,
  DynamicFormControlLayout,
  DynamicFormLayout,
  DynamicFormLayoutService,
  DynamicFormControlComponent,
  DynamicFormValidationService,
} from '@core/custom';

@Component({
  selector: 'dynamic-ng-datepicker',
  templateUrl: './dynamic-ng-datepicker.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DynamicNGDatePickerComponent extends DynamicFormControlComponent {

  @Input() formLayout: DynamicFormLayout;
  @Input() group: FormGroup;
  @Input() layout: DynamicFormControlLayout;
  @Input() model: DynamicDatePickerModel;

  @Output() blur: EventEmitter<any> = new EventEmitter<any> ();
  @Output() change: EventEmitter<any> = new EventEmitter<any> ();
  @Output() customEvent: EventEmitter<DynamicFormControlCustomEvent> = new EventEmitter<DynamicFormControlCustomEvent>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any> ();

  @ViewChild(NgbDatepicker, { static: false }) ngbDatePicker: NgbDatepicker;

  constructor(protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService,
              public config: NgbDatepickerConfig) {

    super(layoutService, validationService);
  }
}
