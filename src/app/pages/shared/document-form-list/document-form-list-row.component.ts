import { Component, Input, Output, EventEmitter, QueryList } from '@angular/core';
import { DynamicFormArrayComponent, DynamicFormArrayModel, DynamicFormLayoutService, DynamicFormValidationService, DynamicFormControlCustomEvent, DynamicTemplateDirective } from '../../../core/custom/ng-dynamic-forms';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'document-form-list-row',
  templateUrl: './document-form-list-row.component.html',
})
export class DocumentFormListRowComponent extends DynamicFormArrayComponent {

  @Input() group: FormGroup;
  @Input() model: DynamicFormArrayModel;
  @Input() templates: QueryList<DynamicTemplateDirective> | undefined;

  @Output() blur: EventEmitter<any> = new EventEmitter();
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() focus: EventEmitter<any> = new EventEmitter();
  @Output() customEvent: EventEmitter<DynamicFormControlCustomEvent> = new EventEmitter();

  constructor(protected layoutService: DynamicFormLayoutService, protected validationService: DynamicFormValidationService) {
    super(layoutService, validationService);
  }
}
