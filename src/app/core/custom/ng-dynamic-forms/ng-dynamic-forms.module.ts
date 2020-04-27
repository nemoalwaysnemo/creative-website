import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicListDirective } from './directive/dynamic-list.directive';
import { DynamicTemplateDirective } from './directive/dynamic-template.directive';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  declarations: [
    DynamicListDirective,
    DynamicTemplateDirective,
  ],
  exports: [
    DynamicListDirective,
    DynamicTemplateDirective,
  ],
})
export class DynamicFormsCoreModule {

}
