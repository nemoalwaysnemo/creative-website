import { Component } from '@angular/core';
import { DynamicSuggestionModel, DynamicBatchUploadModel, DynamicInputModel, DynamicOptionTagModel, DynamicDatepickerDirectiveModel, DynamicAttachmentUploadModel } from '@core/custom';
import { AbstractDisruptionForm } from '../abstract-classes/abstract-disruption-form.component';


@Component({
  selector: 'disruption-form-folder',
  templateUrl: './disruption-form-folder.component.html',
})
export class DisruptionFormFolderComponent extends AbstractDisruptionForm {
  protected parentType = AbstractDisruptionForm.DAY_ASSET;

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
        placeholder: 'Leave blank to copy from Disruption Day',
        required: false,
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:industry',
        label: 'Industry',
        directoryName: 'GLOBAL_Industries',
        placeholder: 'Leave blank to copy from Disruption Day',
      }),
      new DynamicDatepickerDirectiveModel<string>({
        id: 'The_Loupe_ProdCredits:production_date',
        label: 'Published',
        formMode: 'edit',
        placeholder: 'Published',
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:agency',
        label: 'Agency',
        directoryName: 'GLOBAL_Agencies',
        multiple: false,
        placeholder: 'Leave blank to copy from Disruption Day',
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:country',
        label: 'Agency Country',
        directoryName: 'GLOBAL_Countries',
        placeholder: 'Leave blank to copy from Disruption Day',
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:backslash_category',
        label: 'Backslash Category',
        directoryName: 'App-Backslash-Categories',
        formMode: 'edit',
        placeholder: 'Please select category',
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:Tags_edges',
        label: 'Edges',
        directoryName: 'App-Edges-Edges',
        placeholder: 'Leave blank to copy from Disruption Day',
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Main:description',
        label: 'Description',
        formMode: 'edit',
        placeholder: 'description',
      }),
      new DynamicInputModel({
        id: 'dc:creator',
        label: 'Author',
        formMode: 'edit',
        placeholder: 'Author',
      }),
      new DynamicBatchUploadModel<string>({
        id: 'uploadFiles',
        label: 'Attachment',
        formMode: 'create',
        multiUpload: true,
        queueLimit: 25,
        placeholder: 'Drop file here!',
      }),
      new DynamicAttachmentUploadModel<string>({
        id: 'uploadAttachments',
        label: 'Attachment',
        formMode: 'edit',
        queueLimit: 25,
        placeholder: 'Drop file here!',
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
        'The_Loupe_Main:description': {
          element: {
            container: 'p-0',
            label: 'col-form-label',
          },
          grid: {
            host: 'col-sm-4',
          },
        },
        'app_Edges:backslash_category': {
          element: {
            container: 'p-0',
            label: 'col-form-label',
          },
          grid: {
            host: 'col-sm-4',
          },
        },
        'The_Loupe_ProdCredits:production_date': {
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
        'The_Loupe_Main:agency': {
          element: {
            container: 'p-0',
            label: 'col-form-label',
          },
          grid: {
            host: 'col-sm-4',
          },
        },
        'The_Loupe_Main:country': {
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