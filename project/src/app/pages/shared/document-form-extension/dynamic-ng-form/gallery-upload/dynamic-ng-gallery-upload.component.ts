import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DynamicFormControlComponent,
  DynamicFormControlLayout,
  DynamicFormLayoutService,
  DynamicFormValidationService,
  DynamicGalleryUploadModel,
} from '@core/custom';

@Component({
  selector: 'dynamic-ng-gallery-upload',
  templateUrl: './dynamic-ng-gallery-upload.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicNGGalleryUploadComponent extends DynamicFormControlComponent {

  @Input() group: FormGroup;
  @Input() layout: DynamicFormControlLayout;
  @Input() model: DynamicGalleryUploadModel<string>;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();
  @Output() customEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(protected layoutService: DynamicFormLayoutService, protected validationService: DynamicFormValidationService) {
    super(layoutService, validationService);
  }
}
