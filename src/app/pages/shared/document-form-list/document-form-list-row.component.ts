import { Component, Input, Output, EventEmitter, QueryList } from '@angular/core';
import { DynamicFormArrayComponent, DynamicFormArrayModel, DynamicFormLayoutService, DynamicFormValidationService, DynamicFormControlCustomEvent, DynamicTemplateDirective, DynamicFormService, DynamicFormValueControlModel } from '../../../core/custom/ng-dynamic-forms';
import { FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'document-form-list-row',
  templateUrl: './document-form-list-row.component.html',
})
export class DocumentFormListRowComponent extends DynamicFormArrayComponent {

  headers: any[] = [];

  @Input()
  set arrayModel(model: DynamicFormArrayModel)  {
    this.model = model;
    this.headers = model.groups.map(g => g.group.map((m: DynamicFormValueControlModel<any>) => ({ label: m.label, required: m.required}))).shift();
  }
  @Input() group: FormGroup;
  @Input() templates: QueryList<DynamicTemplateDirective> | undefined;

  @Output() blur: EventEmitter<any> = new EventEmitter();
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() focus: EventEmitter<any> = new EventEmitter();
  @Output() customEvent: EventEmitter<DynamicFormControlCustomEvent> = new EventEmitter();

  constructor(protected formService: DynamicFormService, protected layoutService: DynamicFormLayoutService, protected validationService: DynamicFormValidationService) {
    super(layoutService, validationService);
  }

  onRemoveRow(index: number): void {
    const formArrayControl = this.formService.findControlByModel<FormArray>(this.model, this.group);
    this.formService.removeFormArrayGroup(index, formArrayControl, this.model);
    this.formService.detectChanges();
  }
}
