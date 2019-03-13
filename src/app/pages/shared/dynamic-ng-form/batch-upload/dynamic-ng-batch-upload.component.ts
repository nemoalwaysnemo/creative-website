import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DynamicFormControlComponent,
  DynamicFormLayout,
  DynamicFormLayoutService,
  DynamicFormValidationService,
  DynamicBatchUploadModel,
} from '@core/custom';

@Component({
  selector: 'dynamic-ng-batch-upload',
  templateUrl: './dynamic-ng-batch-upload.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicNGBatchUploadComponent extends DynamicFormControlComponent {

  @Input() group: FormGroup;
  @Input() layout: DynamicFormLayout;
  @Input() model: DynamicBatchUploadModel<string>;

  @Output() blur: EventEmitter<any> = new EventEmitter();
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() focus: EventEmitter<any> = new EventEmitter();
  @Output() customEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(protected layoutService: DynamicFormLayoutService,
    protected validationService: DynamicFormValidationService) {

    super(layoutService, validationService);
  }

}