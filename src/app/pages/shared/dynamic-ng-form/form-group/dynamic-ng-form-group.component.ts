import { Component, EventEmitter, forwardRef, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DynamicFormControlCustomEvent,
  DynamicFormControlLayout,
  DynamicFormGroupComponent,
  DynamicFormGroupModel,
  DynamicFormLayout,
  DynamicFormLayoutService,
  DynamicFormValidationService,
  DynamicTemplateDirective,
} from '@core/custom';
import { DynamicNGFormControlContainerComponent } from '../dynamic-ng-form-control-container.component';

@Component({
  selector: 'dynamic-ng-form-group',
  templateUrl: './dynamic-ng-form-group.component.html',
})
export class DynamicNGFormGroupComponent extends DynamicFormGroupComponent {

  @Input() formLayout: DynamicFormLayout;
  @Input() group: FormGroup;
  @Input() layout: DynamicFormControlLayout;
  @Input() model: DynamicFormGroupModel;
  @Input() templates: QueryList<DynamicTemplateDirective> | DynamicTemplateDirective[] | undefined;

  @Output() blur: EventEmitter<any> = new EventEmitter();
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() customEvent: EventEmitter<DynamicFormControlCustomEvent> = new EventEmitter();
  @Output() focus: EventEmitter<any> = new EventEmitter();

  @ViewChildren(forwardRef(() => DynamicNGFormControlContainerComponent)) components: QueryList<DynamicNGFormControlContainerComponent>;

  constructor(protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService) {

    super(layoutService, validationService);
  }
}
