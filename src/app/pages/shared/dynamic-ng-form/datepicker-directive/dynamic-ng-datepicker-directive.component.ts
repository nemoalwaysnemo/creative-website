import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DynamicFormControlComponent,
  DynamicFormLayout,
  DynamicFormLayoutService,
  DynamicFormValidationService,
  DynamicDatepickerDirectiveModel,
} from '@core/custom';

@Component({
  selector: 'dynamic-datepicker-directive',
  templateUrl: './dynamic-ng-datepicker-directive.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicNGDatepickerDirectiveComponent extends DynamicFormControlComponent {

  @Input() group: FormGroup;
  @Input() layout: DynamicFormLayout;
  @Input() model: DynamicDatepickerDirectiveModel<string>;

  @Output() blur: EventEmitter<any> = new EventEmitter();
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() focus: EventEmitter<any> = new EventEmitter();

  constructor(protected layoutService: DynamicFormLayoutService,
    protected validationService: DynamicFormValidationService) {

    super(layoutService, validationService);
  }
}
