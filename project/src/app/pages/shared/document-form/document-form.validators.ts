import { AbstractControl, ValidationErrors, FormControl, AsyncValidatorFn } from '@angular/forms';
import { DocumentPageService } from '../services/document-page.service';
import { GlobalSearchParams, NuxeoPagination } from '@core/api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export function dateFormatValidator(control: FormControl): ValidationErrors | null {
  let hasError = false;
  (control.value && (control.value.toString() === 'Invalid Date')) ? (hasError = true) : (hasError = false);
  return hasError ? { dateFormatValidator: true } : null;
}

export function uniqueDocumentValidator(data: { searchParams: any, documentPageService: DocumentPageService }): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    const params: any = {
      title_eq: control.value,
      currentPageIndex: 0,
      pageSize: 1,
    };
    return data.documentPageService.advanceRequest(new GlobalSearchParams(Object.assign({}, params, data.searchParams))).pipe(
      map((res: NuxeoPagination) => res.entries.length > 0 ? { uniqueDocumentValidator: true } : null),
    );
  };
}
