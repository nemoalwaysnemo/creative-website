import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormControlComponent, DynamicFormControlLayout, DynamicFormLayout, DynamicFormLayoutService, DynamicFormValidationService, DynamicSwitchModel } from '@core/custom';

@Component({
  selector: 'dynamic-ng-switch',
  templateUrl: './dynamic-ng-switch.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DynamicNGSwitchComponent extends DynamicFormControlComponent {

  @Input() formLayout: DynamicFormLayout;
  @Input() group: FormGroup;
  @Input() layout: DynamicFormControlLayout;
  @Input() model: DynamicSwitchModel;

  @Output() blur: EventEmitter<any> = new EventEmitter();
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() focus: EventEmitter<any> = new EventEmitter();

  constructor(protected layoutService: DynamicFormLayoutService, protected validationService: DynamicFormValidationService) {

    super(layoutService, validationService);
  }
}
