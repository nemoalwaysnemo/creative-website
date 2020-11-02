import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DynamicFormControlComponent,
  DynamicFormControlLayout,
  DynamicFormLayoutService,
  DynamicFormValidationService,
  DynamicSuggestionModel,
} from '@core/custom';

@Component({
  selector: 'dynamic-ng-suggestion',
  templateUrl: './dynamic-ng-suggestion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicNGSuggestionComponent extends DynamicFormControlComponent {

  @Input() group: FormGroup;
  @Input() layout: DynamicFormControlLayout;
  @Input() model: DynamicSuggestionModel<string>;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();

  constructor(protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService) {

    super(layoutService, validationService);
  }
}
