import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { DynamicFormComponent, DynamicFormComponentService, DynamicFormControlEvent, DynamicFormModel, DynamicTemplateDirective, DynamicFormService, DynamicFormControlModel } from '@core/custom';
import { DynamicNGFormControlContainerComponent } from './dynamic-ng-form-control-container.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'document-form-element',
  styleUrls: ['./dynamic-ng-form-element.component.scss'],
  templateUrl: './dynamic-ng-form-element.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicNgFormElementComponent extends DynamicFormComponent implements OnInit, OnDestroy {

  @Input()
  set formModel(model: string | DynamicFormControlModel | DynamicFormModel) {
    this.performFormModel(model);
  }

  @Input() group: FormGroup;
  @Output() blur: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output() change: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output() focus: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output() customEvent: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();

  @ContentChildren(DynamicTemplateDirective) templates: QueryList<DynamicTemplateDirective>;
  @ViewChildren(DynamicNGFormControlContainerComponent) components: QueryList<DynamicNGFormControlContainerComponent>;

  constructor(protected formService: DynamicFormService, protected changeDetectorRef: ChangeDetectorRef, protected componentService: DynamicFormComponentService) {
    super(changeDetectorRef, componentService);
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }

  private performFormModel(model: string | DynamicFormControlModel | DynamicFormModel): void {
    if (!model || typeof model === 'string' && model === 'form') {
      this.registerForm();
    } else if (model instanceof DynamicFormControlModel) {
      this.model = [model];
    } else if (Array.isArray(model)) {
      this.model = model;
    }
  }
}
