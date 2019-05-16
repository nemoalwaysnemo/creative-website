import { Component } from '@angular/core';
import { DynamicSuggestionModel, DynamicBatchUploadModel, DynamicInputModel, DynamicOptionTagModel, DynamicDatepickerDirectiveModel } from '@core/custom';
import { AbstractDisruptionForm } from '../abstract-classes/abstract-disruption-form.component';

@Component({
  selector: 'disruption-form-day',
  templateUrl: './disruption-form-day.component.html',
})
export class DisruptionFormDayComponent extends AbstractDisruptionForm {
  protected parentType = AbstractDisruptionForm.DAY;

  protected getSettings(): object[] {
    return [
      new DynamicInputModel({
        id: 'dc:title',
        label: 'Title',
        maxLength: 50,
        placeholder: 'Title',
        autoComplete: 'off',
        required: false,
        validators: {
          required: null,
          minLength: 4,
        },
        errorMessages: {
          required: '{{label}} is required',
          minLength: 'At least 4 characters',
        },
      }),
      new DynamicOptionTagModel({
        id: 'The_Loupe_Main:brand',
        label: 'Brand',
        placeholder: 'Brand',
        required: false,
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:industry',
        label: 'Industry',
        directoryName: 'GLOBAL_Industries',
        placeholder: 'Please select industry',
      }),
      new DynamicDatepickerDirectiveModel<string>({
        id: 'The_Loupe_ProdCredits:production_date',
        label: 'Workshop Date',
        placeholder: 'Workshop Date',
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:Relevant_Country',
        label: 'Geography',
        directoryName: 'GLOBAL_Countries',
        placeholder: 'Please select country',
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:agency',
        label: 'Agency',
        multiple: false,
        directoryName: 'GLOBAL_Agencies',
        placeholder: 'Please select agency',
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:country',
        label: 'Agency Country',
        directoryName: 'GLOBAL_Countries',
        placeholder: 'Please select country',
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:backslash_category',
        label: 'Backslash Category',
        directoryName: 'App-Backslash-Categories',
        placeholder: 'Please select category',
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:Tags_edges',
        label: 'Edges',
        directoryName: 'App-Edges-Edges',
        placeholder: 'Please select edges',
      }),
      new DynamicBatchUploadModel<string>({
        id: 'uploadFiles',
        label: 'Attachment',
        formMode: 'create',
        multiUpload: false,
        queueLimit: 1,
        placeholder: 'Drop Logo/Image here!',
        acceptTypes: 'pdf,bmp,jpg,jpeg,png,tif,gif',
      }),
    ];
  }

  protected getFormLayout(): any {
    return {
      'dc:title': {
        element: {
          container: 'p-0',
          label: 'col-form-label',
        },
        grid: {
          host: 'col-sm-4',
        },
      },
      'The_Loupe_Main:brand': {
        element: {
          container: 'p-0',
          label: 'col-form-label',
        },
        grid: {
          host: 'col-sm-4',
        },
      },
      'app_Edges:industry': {
        element: {
          container: 'p-0',
          label: 'col-form-label',
        },
        grid: {
          host: 'col-sm-4',
        },
      },
      'app_Edges:Relevant_Country': {
        element: {
          container: 'p-0',
          label: 'col-form-label',
        },
        grid: {
          host: 'col-sm-4',
        },
      },
    };
  }

}
