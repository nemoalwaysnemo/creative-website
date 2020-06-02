import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicFormComponent } from './component/dynamic-form.component';
import { DynamicListDirective } from './directive/dynamic-list.directive';
import { DynamicTemplateDirective } from './directive/dynamic-template.directive';
import { DynamicFormGroupComponent } from './component/dynamic-form-group.component';
import { DynamicFormArrayComponent } from './component/dynamic-form-array.component';
import { DynamicFormControlComponent } from './component/dynamic-form-control.component';
import { DynamicFormControlContainerComponent } from './component/dynamic-form-control-container.component';
import { DynamicFormControlWithTemplateComponent } from './component/dynamic-form-control-with-template.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  declarations: [
    DynamicListDirective,
    DynamicTemplateDirective,
    DynamicFormComponent,
    DynamicFormGroupComponent,
    DynamicFormArrayComponent,
    DynamicFormControlComponent,
    DynamicFormControlContainerComponent,
    DynamicFormControlWithTemplateComponent,
  ],
  exports: [
    DynamicListDirective,
    DynamicTemplateDirective,
  ],
})
export class DynamicFormsCoreModule {

}
