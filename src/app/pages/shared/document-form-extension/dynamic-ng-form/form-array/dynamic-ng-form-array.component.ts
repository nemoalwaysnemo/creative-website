import { Component, EventEmitter, forwardRef, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DynamicFormArrayComponent,
  DynamicFormArrayModel,
  DynamicFormControlCustomEvent,
  DynamicFormControlLayout,
  DynamicFormLayout,
  DynamicFormLayoutService,
  DynamicFormValidationService,
  DynamicTemplateDirective,
} from '@core/custom';
import { DynamicNGFormControlContainerComponent } from '../dynamic-ng-form-control-container.component';

@Component({
  selector: 'dynamic-ng-form-array',
  templateUrl: './dynamic-ng-form-array.component.html',
})
export class DynamicNGFormArrayComponent extends DynamicFormArrayComponent {

  @Input() formLayout: DynamicFormLayout;
  @Input() group: FormGroup;
  @Input() layout: DynamicFormControlLayout;
  @Input() model: DynamicFormArrayModel;
  @Input() templates: QueryList<DynamicTemplateDirective> | undefined;

  @Output() blur: EventEmitter<any> = new EventEmitter<any> ();
  @Output() change: EventEmitter<any> = new EventEmitter<any> ();
  @Output() customEvent: EventEmitter<DynamicFormControlCustomEvent> = new EventEmitter<DynamicFormControlCustomEvent> ();
  @Output() focus: EventEmitter<any> = new EventEmitter<any> ();

  @ViewChildren(forwardRef(() => DynamicNGFormControlContainerComponent)) components: QueryList<DynamicNGFormControlContainerComponent>;

  constructor(protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService) {

    super(layoutService, validationService);
  }
}
