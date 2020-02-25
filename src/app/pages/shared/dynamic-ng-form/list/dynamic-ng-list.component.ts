import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DynamicFormControlComponent,
  DynamicFormControlLayout,
  DynamicFormLayoutService,
  DynamicFormValidationService,
  DynamicListModel,
} from '@core/custom';

@Component({
  selector: 'dynamic-ng-list',
  templateUrl: './dynamic-ng-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicNGListComponent extends DynamicFormControlComponent {

  @Input() group: FormGroup;
  @Input() layout: DynamicFormControlLayout;
  @Input() model: DynamicListModel<string>;

  @Output() blur: EventEmitter<any> = new EventEmitter();
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() focus: EventEmitter<any> = new EventEmitter();

  constructor(protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService) {

    super(layoutService, validationService);
  }
}
