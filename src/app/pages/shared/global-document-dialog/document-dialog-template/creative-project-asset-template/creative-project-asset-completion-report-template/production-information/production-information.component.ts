import { Component } from '@angular/core';
import { DynamicSuggestionModel, DynamicBatchUploadModel, DynamicInputModel, DynamicOptionTagModel, DynamicCheckboxModel, DynamicDragDropFileZoneModel } from '@core/custom';
import { BaseDocumentManageComponent } from '@pages/shared/abstract-classes/base-document-manage.component';
import { ActivatedRoute } from '@angular/router';
// import { SuggestionSettings } from '../../../../../directory-suggestion/directory-suggestion-settings';
@Component({
  selector: 'production-information',
  styleUrls: ['./production-information.scss'],
  templateUrl: './production-information.component.html',
})
export class ProductionInformationComponent extends BaseDocumentManageComponent {

  showForm: boolean = false;

  changeView(): void {
    this.showForm = !this.showForm;
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
        layoutPosition: 'bottom',
        formMode: 'edit',
        showInputs: false,
        multiUpload: true,
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
}
