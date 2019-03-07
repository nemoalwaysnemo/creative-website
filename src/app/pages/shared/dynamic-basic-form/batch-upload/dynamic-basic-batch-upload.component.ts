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
  selector: 'dynamic-basic-batch-upload',
  templateUrl: './dynamic-basic-batch-upload.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicBasicBatchUploadComponent extends DynamicFormControlComponent {

  @Input() group: FormGroup;
  @Input() layout: DynamicFormLayout;
  @Input() model: DynamicBatchUploadModel<string>;

  @Output() blur: EventEmitter<any> = new EventEmitter();
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() focus: EventEmitter<any> = new EventEmitter();

  constructor(protected layoutService: DynamicFormLayoutService,
    protected validationService: DynamicFormValidationService) {

    super(layoutService, validationService);
  }

}
