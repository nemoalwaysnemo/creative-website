import { Component, ContentChildren, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DynamicFormComponent,
  DynamicFormControlEvent,
  DynamicFormModel,
  DynamicFormLayout,
  DynamicFormLayoutService,
  DynamicFormService,
  DynamicTemplateDirective,
  DynamicFormControlModel,
} from '@core/custom';
import { DynamicNGFormControlContainerComponent } from './dynamic-ng-form-control-container.component';

@Component({
  selector: 'dynamic-ng-form',
  templateUrl: './dynamic-ng-form.component.html',
})
export class DynamicNGFormComponent extends DynamicFormComponent {

  layoutLeft: DynamicFormModel = [];
  layoutRight: DynamicFormModel = [];
  layoutBottom: DynamicFormModel = [];

  @Input('group') formGroup: FormGroup;
  @Input('model')
  set formModel(formModel: DynamicFormModel) {
    const models = formModel || [];
    models.forEach((model: DynamicFormControlModel) => {
      if (model.layoutPosition === 'bottom') {
        this.layoutBottom.push(model);
      } else if (model.layoutPosition === 'right') {
        this.layoutRight.push(model);
      } else {
        this.layoutLeft.push(model);
      }
    });

  }
  @Input('layout') formLayout: DynamicFormLayout;

  @Output() blur: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output() change: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output() focus: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output() customEvent: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();

  @ContentChildren(DynamicTemplateDirective) templates: QueryList<DynamicTemplateDirective>;
  @ViewChildren(DynamicNGFormControlContainerComponent) components: QueryList<DynamicNGFormControlContainerComponent>;

  constructor(protected formService: DynamicFormService, protected layoutService: DynamicFormLayoutService) {
    super(formService, layoutService);
  }
}
