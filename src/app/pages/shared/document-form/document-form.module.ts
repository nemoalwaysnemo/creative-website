import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbSpinnerModule } from '@core/nebular/theme';
import { ReactiveFormsModule, NG_VALIDATORS, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { DynamicFormsNGUIModule } from '../dynamic-ng-form';
import { DocumentFormComponent } from './document-form.component';
import { customValidator, customDateRangeValidator, customAsyncFormGroupValidator, dateFormatValidator } from './document-form.validators';
import { Validator, DYNAMIC_VALIDATORS, ValidatorFactory } from './../../../core/custom/ng-dynamic-forms/service/dynamic-form-validators';

const COMPONENTS = [DocumentFormComponent];

@NgModule({
  imports: [
    CommonModule,
    NbSpinnerModule,
    ReactiveFormsModule,
    DynamicFormsNGUIModule,
  ],
  declarations: [
    ...COMPONENTS,
  ],
  exports: [
    ...COMPONENTS,
  ],
  providers: [
    {
      provide: NG_VALIDATORS,
      useValue: customValidator,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useValue: customDateRangeValidator,
      multi: true,
    },
    {
      provide: NG_ASYNC_VALIDATORS,
      useValue: customAsyncFormGroupValidator,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useValue: dateFormatValidator,
      multi: true,
    },
    {
      provide: DYNAMIC_VALIDATORS,
      useValue: new Map<string, Validator | ValidatorFactory>([
        ['dateFormatValidator', dateFormatValidator],
      ]),
    },
  ],
})
export class DocumentFormModule {

}
