import { Component } from '@angular/core';
import { AdvanceSearch, DocumentModel } from '@core/api';
import { ActivatedRoute } from '@angular/router';
import { TAB_CONFIG } from '../creative-brand-tab-config';
import { DynamicSuggestionModel, DynamicBatchUploadModel, DynamicInputModel, DynamicOptionTagModel, DynamicCheckboxModel, DynamicDragDropFileZoneModel } from '@core/custom';
import { AbstractDocumentManageComponent, SearchQueryParamsService } from '@pages/shared';
import { NbToastrService } from '@core/nebular/theme';
import { SuggestionSettings } from '@pages/shared/directory-suggestion/directory-suggestion-settings';
import { DocumentFormEvent } from '@pages/shared/document-form/document-form.interface';

@Component({
  selector: 'creative-brand-manage-library',
  styleUrls: ['./creative-brand-manage-library.component.scss'],
  templateUrl: './creative-brand-manage-library.component.html',
})
export class CreativeBrandManageLibraryComponent extends AbstractDocumentManageComponent {

  protected tabConfig: any[] = TAB_CONFIG;

  showForm: boolean = false;

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService,
    private toastrService: NbToastrService,
  ) {
    super(advanceSearch, activatedRoute, queryParamsService);
  }

  changeView() {
    this.showForm = !this.showForm;
  }

  canceleForm(): void {
    this.changeView();
  }

  updateForm(doc: any): void {
    this.toastrService.success('success', `${doc.title} update success`);
    this.changeView();
  }

  onCallback(callback: DocumentFormEvent): void {
    if (callback.action === 'Updated') {
      this.updateForm(callback.doc);
    } else if (callback.action === 'Canceled') {
      this.canceleForm();
    }
  }

  protected getSettings(): any[] {
    return [
      new DynamicInputModel({
        id: 'dc:title',
        label: 'Title',
        maxLength: 50,
        placeholder: 'Title',
        autoComplete: 'off',
        required: true,
        hidden: true,
        validators: {
          required: null,
          minLength: 4,
        },
        errorMessages: {
          required: '{{label}} is required',
          minLength: 'At least 4 characters',
        },
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:folder_type',
        label: 'Folder Type',
        required: true,
        settings: {
          placeholder: 'Folder Type',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Library-Folder-Types',
        },
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Main:description',
        label: 'Description',
        placeholder: 'description',
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'dragDropAssetZone',
        formMode: 'edit',
        uploadType: 'asset',
        layoutPosition: 'right',
        queueLimit: 1,
        placeholder: 'Drop Logo/Image here!',
        acceptTypes: 'image/*',
      }),
      new DynamicBatchUploadModel<string>({
        id: 'files:files',
        layoutPosition: 'right',
        formMode: 'edit',
        showInputs: false,
        multiUpload: true,
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:agency',
        label: 'Agency',
        settings: {
          multiple: false,
          placeholder: 'Please select agency',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Agencies',
        },
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:country',
        label: 'Country',
        settings: {
          placeholder: 'Please select country',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Countries',
        },
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Main:HyperionCode',
        label: 'Hyperion Code',
        maxLength: 50,
        placeholder: 'Hyperion Code',
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Main:CompanyCode',
        label: 'Company Code',
        maxLength: 50,
        placeholder: 'Company Code',
      }),
      new DynamicOptionTagModel({
        id: 'The_Loupe_Main:brand',
        label: 'Brand',
        required: false,
        placeholder: 'Brand',
      }),
      new DynamicOptionTagModel({
        id: 'The_Loupe_Main:clientName',
        label: 'Client Name',
        required: false,
        placeholder: 'Client Name',
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:industry',
        label: 'Industry',
        settings: {
          placeholder: 'Please select industry',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Industries',
        },
      }),
      new DynamicCheckboxModel({
        id: 'app_global:set_defaults',
        label: 'Set Defaults',
      }),
      new DynamicCheckboxModel({
        id: 'app_global:agency_brands_tab',
        label: 'enable Library Brands Tab',
      }),
      new DynamicCheckboxModel({
        id: 'app_global:showcase_tab',
        label: 'enable Library Showcase Tab',
      }),
      new DynamicCheckboxModel({
        id: 'app_global:manage_lists',
        label: 'enable List Management',
      }),
      new DynamicCheckboxModel({
        id: 'app_global:brand_activation',
        label: 'enable Brand Management',
      }),
      new DynamicCheckboxModel({
        id: 'app_global_fields:enable_productlist',
        label: 'Enable Product Management',
      }),
      new DynamicCheckboxModel({
        id: 'app_global:campaign_mgt',
        label: 'enable Campaign & Project Management',
      }),
      new DynamicCheckboxModel({
        id: 'app_global:campaign_assets',
        label: 'Campaign Assets',
      }),
      new DynamicCheckboxModel({
        id: 'app_global:Awards',
        label: 'enable Awards',
      }),
      new DynamicCheckboxModel({
        id: 'app_global:knowledge',
        label: 'enable know\\edge',
      }),
      new DynamicCheckboxModel({
        id: 'app_global:backslash',
        label: 'enable \\backslash',
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:Tags_edges',
        label: 'Edges',
        settings: {
          placeholder: 'Please select edges',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Edges-Edges',
        },
      }),
      new DynamicCheckboxModel({
        id: 'app_global:networkshare',
        label: 'enable TBWA Share',
      }),
      new DynamicCheckboxModel({
        id: 'app_global:ISCI',
        label: 'enable ISCI',
      }),
      new DynamicCheckboxModel({
        id: 'app_global:auto_tagging',
        label: 'enable AI auto tagging',
      }),
      new DynamicCheckboxModel({
        id: 'app_global:download_mainfile',
        label: 'allow Download of Main File',
      }),
      new DynamicCheckboxModel({
        id: 'app_global:download_attachments',
        label: 'Allow Download of Attachments',
      }),
      new DynamicCheckboxModel({
        id: 'app_global:asset_request',
        label: 'enable Asset Requests',
      }),
      new DynamicCheckboxModel({
        id: 'app_global:collections',
        label: 'enable Collections',
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Delivery:disclaimer',
        label: 'Download Disclaimer',
      }),
      new DynamicCheckboxModel({
        id: 'app_global:UsageRights',
        label: 'enable Usage Rights',
      }),
      new DynamicCheckboxModel({
        id: 'app_global:UsageRights_globalref',
        label: 'enable Global Contract Reference',
      }),
      new DynamicCheckboxModel({
        id: 'enable historic Usage Rights',
        label: 'app_global:UsageRights_historic',
      }),
      new DynamicCheckboxModel({
        id: 'app_global:library_report',
        label: 'enable Library Report',
      }),
      new DynamicCheckboxModel({
        id: 'app_global:app_global:completion_report',
        label: 'enable Project Completion Reports',
      }),
      new DynamicCheckboxModel({
        id: 'app_global_fields:enable_region',
        label: 'enable Region',
      }),
      new DynamicCheckboxModel({
        id: 'app_global_fields:enable_productyear',
        label: 'enable Product Year',
      }),
      new DynamicCheckboxModel({
        id: 'app_global_fields:enable_jobnumber',
        label: 'Enable Jobnumber',
      }),
      new DynamicCheckboxModel({
        id: 'app_global_fields:enable_po_number_internal',
        label: 'enable PO Number Internal',
      }),
      new DynamicCheckboxModel({
        id: 'app_global_fields:enable_po_number_client',
        label: 'enable PO Number Client',
      }),
      new DynamicCheckboxModel({
        id: 'app_global_fields:enable_po_number_vendor',
        label: 'enable PO Number Vendor',
      }),
      new DynamicCheckboxModel({
        id: 'app_global:UsageRights_for_clients',
        label: 'enable Usage Rights For Clients',
      }),
      new DynamicCheckboxModel({
        id: 'app_global:backslash_for_clients',
        label: 'enable Backslash For Clients',
      }),
      new DynamicCheckboxModel({
        id: 'app_global:knowledge_for_clients',
        label: 'enable know\edge For Clients',
      }),
      new DynamicCheckboxModel({
        id: 'app_global:campaigns_for_clients',
        label: 'enable Campaigns For Clients',
      }),
      new DynamicCheckboxModel({
        id: 'app_global:projects_for_clients',
        label: 'enable Projects For Clients',
      }),
      new DynamicCheckboxModel({
        id: 'app_global:download_mainfile_for_clients',
        label: 'enable Download Main file For Clients',
      }),
      new DynamicCheckboxModel({
        id: 'app_global:download_attachments_for_clients',
        label: 'enable Download Attachments For Clients',
      }),
      new DynamicCheckboxModel({
        id: 'app_global:collections_for_clients',
        label: 'enable Collections For Clients',
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
