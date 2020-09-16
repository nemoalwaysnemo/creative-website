import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DynamicFormComponent, DynamicFormComponentService,
  DynamicFormControlEvent,
  DynamicFormLayout,
  DynamicFormModel,
  DynamicTemplateDirective,
  DynamicFormService,
  DynamicFormControlModel,
} from '@core/custom';
import { DynamicNGFormControlContainerComponent } from './dynamic-ng-form-control-container.component';

@Component({
  selector: 'dynamic-ng-form',
  styleUrls: ['./dynamic-ng-form.component.scss'],
  templateUrl: './dynamic-ng-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicNGFormComponent extends DynamicFormComponent {

  layoutLeft: DynamicFormModel = [];

  layoutRight: DynamicFormModel = [];

  layoutBottom: DynamicFormModel = [];

  layoutAccordion: any = [];

  @Input()
  set modelOperation(operation: any) {
    operation.subscribe(opt => {
      if (opt.type === 'delete') {
        this.deleteModel(opt.id);
      }
      if (opt.type === 'hide') {
        this.hideModel(opt.id);
      }
    });
  }

  @Input() formClass: string;

  @Input() group: FormGroup;

  @Input('accordions')
  set accordionsStructure(accordions: any[]) {
    if (accordions) {
      for (const item of accordions) {
        this.layoutAccordion.push({ accordionTabName: item.name, modelsContents: (item.items || []), position: (item.position || '') });
      }
    }
  }

  @Input('model')
  set formModel(formModel: DynamicFormModel) {
    const models = formModel || [];
    models.forEach((model: DynamicFormControlModel) => {
      if (!model.accordionTab) {
        if (model.layoutPosition === 'bottom') {
          this.layoutBottom.push(model);
        } else if (model.layoutPosition === 'right') {
          this.layoutRight.push(model);
        } else {
          this.layoutLeft.push(model);
        }
      } else {
        this.layoutAccordion.forEach(element => {
          if (element['accordionTabName'] === model.accordionTab) {
            element['modelsContents'].push(model);
            element['position'] = model.layoutPosition;
          }
        });
      }
    });
  }
  @Input() layout: DynamicFormLayout;

  @Output() blur: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output() change: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output() focus: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output() customEvent: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();

  @ContentChildren(DynamicTemplateDirective) templates: QueryList<DynamicTemplateDirective>;
  @ViewChildren(DynamicNGFormControlContainerComponent) components: QueryList<DynamicNGFormControlContainerComponent>;

  constructor(protected formService: DynamicFormService,
              protected changeDetectorRef: ChangeDetectorRef,
              protected componentService: DynamicFormComponentService) {
    super(changeDetectorRef, componentService);
  }

  deleteModel(id: string): void {
    [this.layoutLeft, this.layoutRight, this.layoutBottom].forEach(models => {
      const index = models.findIndex(model => {
        return model.id === id;
      });
      if (index > -1) {
        this.formService.removeFormGroupControl(index, this.group, models);
      }
    });
  }

  hideModel(id: string): void {
    this.hideSwich(id, true);
  }

  private hideSwich(id: string, type: boolean): void {
    [this.layoutLeft, this.layoutRight, this.layoutBottom].forEach(models => {
      models.forEach(model => {
        if (model.id === id) {
          model.hidden = type;
        }
      });
    });
  }

}
