import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DynamicFormControlLayout,
  DynamicFormLayout,
  DynamicFormLayoutService,
  DynamicFormValidationService,
  DynamicFormControlComponent,
  DynamicRadioGroupModel,
} from '@core/custom';

@Component({
  selector: 'dynamic-ng-radio-group',
  templateUrl: './dynamic-ng-radio-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicNGRadioGroupComponent extends DynamicFormControlComponent {

  @Input() formLayout: DynamicFormLayout;
  @Input() group: FormGroup;
  @Input() layout: DynamicFormControlLayout;
  @Input() model: DynamicRadioGroupModel<string>;

  @Output() blur: EventEmitter<any> = new EventEmitter();
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() focus: EventEmitter<any> = new EventEmitter();

  constructor(protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService) {

    super(layoutService, validationService);
  }
}
