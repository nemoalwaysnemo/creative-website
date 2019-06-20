import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DynamicFormControlComponent,
  DynamicFormLayout,
  DynamicFormLayoutService,
  DynamicFormValidationService,
  DynamicAttachmentUploadModel,
} from '@core/custom';

@Component({
  selector: 'dynamic-ng-attchment-upload',
  templateUrl: './dynamic-ng-attachment-upload.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicNGAttachmentUploadComponent extends DynamicFormControlComponent {

  @Input() group: FormGroup;
  @Input() layout: DynamicFormLayout;
  @Input() model: DynamicAttachmentUploadModel<string>;

  @Output() blur: EventEmitter<any> = new EventEmitter();
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() focus: EventEmitter<any> = new EventEmitter();
  @Output() customEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(protected layoutService: DynamicFormLayoutService,
    protected validationService: DynamicFormValidationService) {

    super(layoutService, validationService);
  }

  onValid(event): void {
    this.customEvent.emit({ customEvent: event, customEventType: 'VALID' });
  }
}
