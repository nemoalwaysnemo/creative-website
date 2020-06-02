import { QueryList, Component } from '@angular/core';
import { DynamicFormControlComponent } from './dynamic-form-control.component';
import { DynamicFormGroupModel } from '../model/form-group/dynamic-form-group.model';
import { DynamicFormControlContainerComponent } from './dynamic-form-control-container.component';

@Component({
  template: '',
})
export class DynamicFormGroupComponent extends DynamicFormControlComponent {

  components: QueryList<DynamicFormControlContainerComponent>;
  model: DynamicFormGroupModel;

  markForCheck() {
    if (this.components instanceof QueryList) {
      this.components.forEach(component => component.markForCheck());
    }
  }
}
