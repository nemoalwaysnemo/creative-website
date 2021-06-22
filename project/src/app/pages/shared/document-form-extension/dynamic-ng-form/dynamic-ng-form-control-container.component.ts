import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ContentChildren,
  EventEmitter,
  HostBinding,
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
  DynamicFormComponentService,
  DynamicFormControl,
  DynamicFormControlContainerComponent,
  DynamicFormControlEvent,
  DynamicFormControlModel,
  DynamicFormLayout,
  DynamicFormLayoutService,
  DynamicFormRelationService,
  DynamicFormValidationService,
  DynamicTemplateDirective,
} from '@core/custom';
import { ngBootstrapUIFormControlMapFn } from './dynamic-ng-form-field';

@Component({
  selector: 'dynamic-ng-form-control',
  templateUrl: './dynamic-ng-form-control-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicNGFormControlContainerComponent extends DynamicFormControlContainerComponent {

  @ContentChildren(DynamicTemplateDirective) contentTemplateList: QueryList<DynamicTemplateDirective>;

  @HostBinding('class') klass = '';

  @Input() context: DynamicFormArrayGroupModel | null = null;
  @Input() group: FormGroup;
  @Input() hostClass: string[];
  @Input('templates') inputTemplateList: QueryList<DynamicTemplateDirective>;
  @Input() layout: DynamicFormLayout;
  @Input() model: DynamicFormControlModel;

  @Output() blur: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output() change: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output() focus: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output() customEvent: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();

  @ViewChild('componentViewContainer', { read: ViewContainerRef, static: true }) componentViewContainerRef: ViewContainerRef;

  constructor(protected changeDetectorRef: ChangeDetectorRef,
              protected componentFactoryResolver: ComponentFactoryResolver,
              protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService,
              protected componentService: DynamicFormComponentService,
              protected relationService: DynamicFormRelationService) {

    super(changeDetectorRef, componentFactoryResolver, layoutService, validationService, componentService, relationService);
  }

  get componentType(): Type<DynamicFormControl> | null {
    return this.componentService.getCustomComponentType(this.model) || ngBootstrapUIFormControlMapFn(this.model);
  }
}
