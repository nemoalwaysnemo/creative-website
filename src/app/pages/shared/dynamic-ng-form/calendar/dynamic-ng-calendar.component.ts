import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbDatepicker, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import {
  DynamicDatePickerModel,
  DynamicFormLayout,
  DynamicFormLayoutService,
  DynamicFormValidationService,
  DynamicFormControlComponent,
} from '@core/custom';

@Component({
  selector: 'dynamic-ng-calendar',
  templateUrl: './dynamic-ng-calendar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicNGCalendarComponent extends DynamicFormControlComponent {

  @Input() group: FormGroup;
  @Input() layout: DynamicFormLayout;
  @Input() model: DynamicDatePickerModel;

  @Output() blur: EventEmitter<any> = new EventEmitter();
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() focus: EventEmitter<any> = new EventEmitter();

  @ViewChild(NgbDatepicker) ngbCalendar: NgbDatepicker;

  constructor(protected layoutService: DynamicFormLayoutService,
    protected validationService: DynamicFormValidationService,
    public config: NgbDatepickerConfig) {

    super(layoutService, validationService);
  }
}
