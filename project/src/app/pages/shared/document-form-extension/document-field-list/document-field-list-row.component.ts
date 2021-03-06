import { Component, Input, Output, EventEmitter, QueryList } from '@angular/core';
import { DynamicFormArrayComponent, DynamicFormArrayModel, DynamicFormLayoutService, DynamicFormValidationService, DynamicFormControlCustomEvent, DynamicTemplateDirective, DynamicFormService, DynamicFormValueControlModel } from '@core/custom/ng-dynamic-forms';
import { FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'document-field-list-row',
  templateUrl: './document-field-list-row.component.html',
})
export class DocumentFieldListRowComponent extends DynamicFormArrayComponent {

  headers: any[] = [];

  @Input()
  set arrayModel(model: DynamicFormArrayModel)  {
    this.model = model;
    this.headers = model.groups.map(g => g.group.map((m: DynamicFormValueControlModel<any>) => ({ label: m.label, required: m.required}))).shift();
  }
  @Input() group: FormGroup;
  @Input() templates: QueryList<DynamicTemplateDirective> | undefined;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();
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
