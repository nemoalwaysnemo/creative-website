import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DynamicFormControlLayout,
  DynamicFormLayout,
  DynamicFormLayoutService,
  DynamicFormValidationService,
  DynamicFormControlComponent,
  DynamicSelectModel,
} from '@core/custom';

@Component({
  selector: 'dynamic-ng-select',
  templateUrl: './dynamic-ng-select.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DynamicNGSelectComponent extends DynamicFormControlComponent {

  @Input() formLayout: DynamicFormLayout;
  @Input() group: FormGroup;
  @Input() layout: DynamicFormControlLayout;
  @Input() model: DynamicSelectModel<string>;

  @Output() blur: EventEmitter<any> = new EventEmitter();
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() focus: EventEmitter<any> = new EventEmitter();

  constructor(protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService) {

    super(layoutService, validationService);
  }
}
