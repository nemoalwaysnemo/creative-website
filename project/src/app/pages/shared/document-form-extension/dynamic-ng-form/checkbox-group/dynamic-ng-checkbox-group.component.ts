import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DynamicCheckboxGroupModel,
  DynamicCheckboxModel,
  DynamicFormControlLayout,
  DynamicFormLayout,
  DynamicFormLayoutService,
  DynamicFormControlComponent,
  DynamicFormValidationService,
} from '@core/custom';

@Component({
  selector: 'dynamic-ng-checkbox-group',
  templateUrl: './dynamic-ng-checkbox-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicNGCheckboxGroupComponent extends DynamicFormControlComponent {

  @Input() formLayout: DynamicFormLayout;
  @Input() group: FormGroup;
  @Input() layout: DynamicFormControlLayout;
  @Input() model: DynamicCheckboxGroupModel;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();

  constructor(protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService) {

    super(layoutService, validationService);
  }

  getCheckboxId(model: DynamicCheckboxModel): any {
    return this.layoutService.getElementId(model);
  }

  onCheckboxChange($event: Event, model: DynamicCheckboxModel): void {
    this.onChange($event);
    model.value = ($event.target as HTMLInputElement).checked;
  }
}
