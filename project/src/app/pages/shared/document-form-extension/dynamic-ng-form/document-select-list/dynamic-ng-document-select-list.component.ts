import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DynamicDocumentSelectListModel,
  DynamicFormControlComponent,
  DynamicFormControlLayout,
  DynamicFormLayoutService,
  DynamicFormValidationService,
} from '@core/custom';

@Component({
  selector: 'dynamic-ng-document-select-list',
  templateUrl: './dynamic-ng-document-select-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicNGDocumentSelectListComponent extends DynamicFormControlComponent {

  @Input() group: FormGroup;
  @Input() layout: DynamicFormControlLayout;
  @Input() model: DynamicDocumentSelectListModel<string>;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();
  @Output() customEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService) {
    super(layoutService, validationService);
  }

  onValid(event: any): void {
    this.customEvent.emit({ customEvent: event, customEventType: 'VALID' });
  }
}
