import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, NG_VALIDATORS, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { DynamicFormsNGUIModule } from '../dynamic-ng-form';
import { DocumentFormComponent } from './document-form.component';
import { customValidator, customDateRangeValidator, customAsyncFormGroupValidator, customForbiddenValidator } from './document-form.validators';

const COMPONENTS = [DocumentFormComponent];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DynamicFormsNGUIModule,
  ],
  declarations: [...COMPONENTS],
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
  ],
})
export class DocumentFormModule {

}
