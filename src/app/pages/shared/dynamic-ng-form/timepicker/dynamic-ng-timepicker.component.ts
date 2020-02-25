import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbTimepicker, NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import {
  DynamicFormControlLayout,
  DynamicFormLayout,
  DynamicFormLayoutService,
  DynamicFormValidationService,
  DynamicFormControlComponent,
  DynamicTimePickerModel,
} from '@core/custom';

@Component({
  selector: 'dynamic-ng-timepicker',
  templateUrl: './dynamic-ng-timepicker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicNGTimePickerComponent extends DynamicFormControlComponent {

  @Input() formLayout: DynamicFormLayout;
  @Input() group: FormGroup;
  @Input() layout: DynamicFormControlLayout;
  @Input() model: DynamicTimePickerModel;

  @Output() blur: EventEmitter<any> = new EventEmitter();
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() focus: EventEmitter<any> = new EventEmitter();

  @ViewChild(NgbTimepicker, { static: true }) ngbTimePicker: NgbTimepicker;

  constructor(protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService,
              public config: NgbTimepickerConfig) {

    super(layoutService, validationService);
  }
}
