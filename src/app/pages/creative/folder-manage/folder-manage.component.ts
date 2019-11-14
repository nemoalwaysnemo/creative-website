import { Component, OnInit } from '@angular/core';
import { AdvanceSearch } from '@core/api';
import { ActivatedRoute } from '@angular/router';
import { TAB_CONFIG } from '../creative-tab-config';
import { AbstractDocumentManageComponent, SearchQueryParamsService } from '@pages/shared';
import { DynamicSuggestionModel, DynamicInputModel, DynamicOptionTagModel } from '@core/custom';

@Component({
  selector: 'folder-manage',
  styleUrls: ['./folder-manage.component.scss'],
  templateUrl: './folder-manage.component.html',
})
export class FolderManageComponent extends AbstractDocumentManageComponent implements OnInit {

  settings: any[] = [];

  protected tabConfig: any[] = TAB_CONFIG;

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService) {
    super(advanceSearch, activatedRoute, queryParamsService);
  }

  private showForm: boolean = false;

  changeView() {
    this.showForm = !this.showForm;
    this.settings = this.getSettings();
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

  private getSettings(): object[] {
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
        id: 'The_Loupe_Main:clientName',
        label: 'Client',
        placeholder: 'Client',
        required: false,
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
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:library_librarians',
        label: 'Librarians',
        initSearch: false,
        searchUserGroup: true,
        placeholder: 'Please select librarians',
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:library_owners',
        label: 'Library Owners',
        initSearch: false,
        searchUserGroup: true,
        placeholder: 'Please select Library Owners',
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:country',
        label: 'Agency Country',
        directoryName: 'GLOBAL_Countries',
        placeholder: 'Please select country',
      }),
      // new DynamicSuggestionModel<string>({
      //   id: 'The_Loupe_Rights:contract_mediatypes',
      //   label: 'Usage Rights Media Usage Types',
      //   directoryName: 'App-Library-UR-contract-mediatype',
      // }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:assettypes_image',
        label: 'Image Asset Types',
        directoryName: 'App-Library-MediaTypes-Image',
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:assettypes_video',
        label: 'Video Asset Types',
        directoryName: 'App-Library-MediaTypes-Video',
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:assettypes_audio',
        label: 'Audio Asset Types',
        directoryName: 'App-Library-MediaTypes-Audio',
      }),
    ];
  }
}
