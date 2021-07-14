import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbSpinnerModule } from '@core/nebular/theme';
import { ReactiveFormsModule, NG_VALIDATORS, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { Validator, DYNAMIC_VALIDATORS, ValidatorFactory } from '@core/custom/ng-dynamic-forms/service/dynamic-form-validators';
import { DynamicFormsNGUIModule } from '../document-form-extension/dynamic-ng-form';
import { dateFormatValidator, uniqueDocumentValidator } from './document-form.validators';
import { BaseDocumentFormComponent } from './base-document-form.component';
import { DocumentImportComponent } from './document-import.component';
import { DocumentFormComponent } from './document-form.component';

const COMPONENTS = [BaseDocumentFormComponent, DocumentFormComponent, DocumentImportComponent];

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
    DynamicFormsNGUIModule,
  ],
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useValue: uniqueDocumentValidator,
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
        ['uniqueDocumentValidator', uniqueDocumentValidator],
      ]),
    },
  ],
})
export class DocumentFormModule {

}
