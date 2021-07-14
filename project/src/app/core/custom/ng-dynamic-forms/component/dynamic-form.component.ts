import { Component, ChangeDetectorRef, EventEmitter, OnDestroy, OnInit, QueryList } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormControlContainerComponent } from './dynamic-form-control-container.component';
import { DynamicFormControlEvent } from './dynamic-form-control-event';
import { DynamicFormControlModel } from '../model/dynamic-form-control.model';
import { DynamicFormModel } from '../model/dynamic-form.model';
import { DynamicTemplateDirective } from '../directive/dynamic-template.directive';
import { DynamicFormLayout } from '../service/dynamic-form-layout.service';
import { DynamicFormComponentService } from '../service/dynamic-form-component.service';

@Component({
  template: '',
})
export class DynamicFormComponent implements OnInit, OnDestroy {

  group: FormGroup;
  model: DynamicFormModel;
  layout: DynamicFormLayout;

  components: QueryList<DynamicFormControlContainerComponent>;
  templates: QueryList<DynamicTemplateDirective>;

  blur: EventEmitter<DynamicFormControlEvent>;
  change: EventEmitter<DynamicFormControlEvent>;
  focus: EventEmitter<DynamicFormControlEvent>;

  constructor(protected changeDetectorRef: ChangeDetectorRef, protected componentService: DynamicFormComponentService) {
  }

  ngOnInit(): void {
    this.registerForm();
  }

  ngOnDestroy(): void {
    this.unregisterForm();
  }

  trackByFn(_index: number, model: DynamicFormControlModel): string {
    return model.field;
  }

  markForCheck(): void {
    this.changeDetectorRef.markForCheck();

    if (this.components instanceof QueryList) {
      this.components.forEach(component => component.markForCheck());
    }
  }

  detectChanges(): void {
    this.changeDetectorRef.detectChanges();
  }

  onBlur($event: DynamicFormControlEvent): void {
    this.blur.emit($event);
  }

  onChange($event: DynamicFormControlEvent): void {
    this.change.emit($event);
  }

  onFocus($event: DynamicFormControlEvent): void {
    this.focus.emit($event);
  }

  onCustomEvent($event: DynamicFormControlEvent, customEventEmitter: EventEmitter<DynamicFormControlEvent>): void {
    customEventEmitter.emit($event);
  }

  protected registerForm(): void {
    this.componentService.registerForm(this);
  }

  protected unregisterForm(): void {
    this.componentService.unregisterForm(this);
  }
}
