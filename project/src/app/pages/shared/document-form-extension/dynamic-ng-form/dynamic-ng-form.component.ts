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
import { isValueEmpty } from '@core/services/helpers';
import { NbTabComponent } from '@core/nebular/theme/components/tabset/tabset.component';
import { DynamicNGFormControlContainerComponent } from './dynamic-ng-form-control-container.component';
import { DynamicNGFormSettings } from './dynamic-ng-form.interface';

@Component({
  selector: 'dynamic-ng-form',
  styleUrls: ['./dynamic-ng-form.component.scss'],
  templateUrl: './dynamic-ng-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicNGFormComponent extends DynamicFormComponent {

  layoutAccordion: any = [];

  layoutSwitchTab: any = [];

  enableLayoutRight: boolean = false;

  private ngFormModel: DynamicFormModel = [];

  @Input()
  set modelOperation(operation: any) {
    if (!isValueEmpty(operation)) {
      if (operation.type === 'delete') {
        this.deleteModel([operation.model]);
      }
      if (operation.type === 'hide') {
        this.hideModel([operation.model], true);
      }
    }
  }

  @Input()
  set formModel(model: DynamicFormModel) {
    if (!isValueEmpty(model)) {
      this.ngFormModel = model;
    }
  }

  @Input()
  set settings(settings: DynamicNGFormSettings) {
    if (!isValueEmpty(settings)) {
      this.performFormSettings(settings);
    }
  }

  @Input() group: FormGroup;
  @Input() layout: DynamicFormLayout;
  @Input() formClass: string;

  @Output() blur: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output() change: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output() focus: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output() customEvent: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();

  @ContentChildren(DynamicTemplateDirective) templates: QueryList<DynamicTemplateDirective>;
  @ViewChildren(DynamicNGFormControlContainerComponent) components: QueryList<DynamicNGFormControlContainerComponent>;

  constructor(protected formService: DynamicFormService, protected changeDetectorRef: ChangeDetectorRef, protected componentService: DynamicFormComponentService) {
    super(changeDetectorRef, componentService);
  }

  getFormModel(position: string): DynamicFormModel {
    return this.ngFormModel.filter((model: DynamicFormControlModel) => (position === 'left' ? model.layoutPosition === 'left' || !model.layoutPosition : model.layoutPosition === position) && !model.accordionTab && !model.switchTab);
  }

  deleteModel(ids: string[]): void {
    this.ngFormModel.forEach((m: DynamicFormControlModel, index: number) => {
      if (ids.includes(m.field)) {
        this.formService.removeFormGroupControl(index, this.group, this.ngFormModel);
      }
    });
  }

  onChangTab(tab: NbTabComponent): void {
    const model = this.getModelByTabName(tab.tabTitle);
    this.onCustomEvent({ tabs: this.layoutSwitchTab, selected: tab, model, type: 'SWITCH_TAB_CHANGED' }, this.customEvent);
  }

  private getModelByTabName(name: string): DynamicFormControlModel {
    const tab = this.layoutSwitchTab.find((x: any) => x.name === name);
    return tab ? tab.models : [];
  }

  private hideModel(ids: string[], type: boolean): void {
    this.ngFormModel.forEach((m: DynamicFormControlModel) => {
      if (ids.includes(m.field)) {
        m.hidden = type;
      }
    });
  }

  private performFormSettings(settings: DynamicNGFormSettings): void {
    if (settings.formModel && settings.formModel.length > 0) {
      this.ngFormModel = settings.formModel;
      this.layoutAccordion = settings.accordionSettings;
      this.layoutSwitchTab = settings.switchTabSettings;
      this.enableLayoutRight = settings.enableLayoutRight;
      this.layout = settings.formLayout;
      this.formClass = settings.formClass;
    }
  }

}
