import { Component, OnInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { DocumentModel, DocumentRepository } from '@core/api';
import { DynamicSuggestionModel, DynamicBatchUploadModel, DynamicInputModel, DynamicDatePickerModel, DynamicDatepickerDirectiveModel, DynamicDragDropFileZoneModel } from '@core/custom';
import { PreviewDialogService } from '@pages/shared';
import { DynamicOptionTagModel } from '@core/custom/ng-dynamic-forms/model/option-tag/dynamic-option-tag.model';

@Component({
  selector: 'playground',
  styleUrls: ['./playground.component.scss'],
  templateUrl: './playground.component.html',
})
export class PlaygroundComponent implements OnInit, OnChanges, OnDestroy {

  settings: any[] = [];

  document: DocumentModel;

  constructor(private documentRepository: DocumentRepository, private previewDialogService: PreviewDialogService) {

  }
  ngOnInit(): void {
    this.create();
    // this.update();
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnDestroy(): void {

  }

  openForm(dialog: any): void {
    this.previewDialogService.open(dialog, this.document, { subDocTypes: ['App-Library-Image'] });
  }

  private create(): void {
    this.documentRepository.get('5487a983-cf80-4a74-bb25-f9e9f54b0ed9').subscribe((doc: DocumentModel) => {
      this.settings = this.getSettings();
      this.document = new DocumentModel({ path: doc.uid, type: 'App-Library-Image' });
    });
  }

  private update(): void {
    this.documentRepository.get('5487a983-cf80-4a74-bb25-f9e9f54b0ed9').subscribe((doc: DocumentModel) => {
      this.document = doc;
      this.settings = this.getSettings();
    });
  }

  private getSettings(): object[] {
    return [
      // new DynamicInputModel({
      //   id: 'dc:title',
      //   label: 'Title',
      //   maxLength: 50,
      //   placeholder: 'Title',
      //   autoComplete: 'off',
      //   required: false,
      //   validators: {
      //     required: null,
      //     minLength: 4,
      //   },
      //   errorMessages: {
      //     required: '{{label}} is required',
      //     minLength: 'At least 4 characters',
      //   },
      // }),
      // new DynamicOptionTagModel({
      //   id: 'The_Loupe_Main:brand',
      //   label: 'Brand',
      //   placeholder: 'Brand',
      //   required: false,
      // }),
      // // new DynamicDatePickerModel({
      // //   id: 'The_Loupe_ProdCredits:production_date',
      // //   label: 'Production Date',
      // //   placeholder: 'Production Date',
      // // }),
      // new DynamicDatepickerDirectiveModel<string>({
      //   id: 'The_Loupe_ProdCredits:production_date',
      //   label: 'Production Date',
      //   placeholder: 'Production Date',
      // }),
      // new DynamicSuggestionModel<string>({
      //   id: 'app_Edges:industry',
      //   label: 'Industry',
      //   directoryName: 'GLOBAL_Industries',
      //   placeholder: 'Please select industry',
      // }),
      // new DynamicSuggestionModel<string>({
      //   id: 'app_Edges:Relevant_Country',
      //   label: 'Geography',
      //   directoryName: 'GLOBAL_Countries',
      //   placeholder: 'Please select country',
      // }),
      // new DynamicSuggestionModel<string>({
      //   id: 'The_Loupe_Main:agency',
      //   label: 'Agency',
      //   directoryName: 'GLOBAL_Agencies',
      //   placeholder: 'Please select agency',
      // }),
      // new DynamicSuggestionModel<string>({
      //   id: 'The_Loupe_Main:country',
      //   label: 'Agency Country',
      //   directoryName: 'GLOBAL_Countries',
      //   placeholder: 'Please select country',
      // }),
      // new DynamicSuggestionModel<string>({
      //   id: 'app_Edges:backslash_category',
      //   label: 'Backslash Category',
      //   directoryName: 'App-Backslash-Categories',
      //   placeholder: 'Please select category',
      // }),
      // new DynamicSuggestionModel<string>({
      //   id: 'app_Edges:Tags_edges',
      //   label: 'Edges',
      //   directoryName: 'App-Edges-Edges',
      //   placeholder: 'Please select edges',
      // }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'dragDropAssetZone',
        formMode: 'create',
        uploadType: 'asset',
        queueLimit: 25,
        placeholder: 'Drop Logo/Image here!',
        acceptTypes: 'pdf,bmp,jpg,jpeg,png,gif',
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'dragDropAssetZone',
        formMode: 'edit',
        uploadType: 'asset',
        queueLimit: 1,
        placeholder: 'Drop Logo/Image here!',
        acceptTypes: 'pdf,bmp,jpg,jpeg,png,gif',
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'dragDropAttachmentZone',
        formMode: 'edit',
        uploadType: 'attachment',
        queueLimit: 1,
        placeholder: 'Drop to upload attachment',
        acceptTypes: 'pdf,bmp,jpg,jpeg,png,gif',
      }),
      new DynamicBatchUploadModel<string>({
        id: 'uploadFiles',
        multiUpload: true,
      }),
    ];
  }

  getFormLayout(): any {
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
