import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DynamicFormControlComponent,
  DynamicFormControlLayout,
  DynamicFormLayoutService,
  DynamicFormValidationService,
  DynamicOptionTagModel,
} from '@core/custom';

@Component({
  selector: 'dynamic-ng-option-tag',
  templateUrl: './dynamic-ng-option-tag.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicNGOptionTagComponent extends DynamicFormControlComponent {

  @Input() group: FormGroup;
  @Input() layout: DynamicFormControlLayout;
  @Input() model: DynamicOptionTagModel<string>;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();

  constructor(protected layoutService: DynamicFormLayoutService, protected validationService: DynamicFormValidationService) {
    super(layoutService, validationService);
  }
}
