import {
  Component,
  ComponentFactoryResolver,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DynamicFormArrayGroupModel,
  DynamicFormControl,
  DynamicFormControlContainerComponent,
  DynamicFormControlEvent,
  DynamicFormControlModel,
  DynamicFormInstancesService,
  DynamicFormLayout,
  DynamicFormLayoutService,
  DynamicFormValidationService,
  DynamicTemplateDirective,
} from '@core/custom';
import { ngBootstrapUIFormControlMapFn } from './dynamic-ng-form-field';

@Component({
  selector: 'dynamic-ng-form-control',
  templateUrl: './dynamic-ng-form-control-container.component.html',
})
export class DynamicNGFormControlContainerComponent extends DynamicFormControlContainerComponent {

  @ContentChildren(DynamicTemplateDirective) contentTemplateList: QueryList<DynamicTemplateDirective>;
  @Input('templates') inputTemplateList: QueryList<DynamicTemplateDirective>;

  @Input() asBootstrapFormGroup: boolean = true;
  @Input() context: DynamicFormArrayGroupModel | null = null;
  @Input() group: FormGroup;
  @Input() layout: DynamicFormLayout;
  @Input() model: DynamicFormControlModel;

  @Output() blur: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output() change: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output() focus: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output() customEvent: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();

  @ViewChild('componentViewContainer', { static: true, read: ViewContainerRef }) componentViewContainerRef: ViewContainerRef;

  constructor(protected componentFactoryResolver: ComponentFactoryResolver,
              protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService,
              protected dynamicFormInstancesService: DynamicFormInstancesService) {
    super(componentFactoryResolver, layoutService, validationService, dynamicFormInstancesService);
  }

  get componentType(): Type<DynamicFormControl> | null {
    return ngBootstrapUIFormControlMapFn(this.model) || this.layoutService.getCustomComponentType(this.model);
  }
}
