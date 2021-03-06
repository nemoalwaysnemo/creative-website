import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { DocumentModel } from '@core/api';
import { BaseDocumentManageComponent, DocumentPageService } from '@pages/shared';
import { DynamicSuggestionModel, DynamicBatchUploadModel, DynamicInputModel, DynamicOptionTagModel, DynamicCheckboxModel, DynamicDragDropFileZoneModel } from '@core/custom';
import { DocumentFormEvent, DocumentFormSettings } from '../../../shared/document-form/document-form.interface';
import { SuggestionSettings } from '../../../shared/document-form-extension';

@Component({
  selector: 'creative-agency-manage-library',
  styleUrls: ['./creative-agency-manage-library.component.scss'],
  templateUrl: './creative-agency-manage-library.component.html',
})
export class CreativeAgencyManageLibraryComponent extends BaseDocumentManageComponent {

  showForm: boolean = false;

  redirectUrl: string = this.documentPageService.getCurrentUrl();

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
  ) {
    super(activatedRoute, documentPageService);
  }

  changeView(): void {
    this.showForm = !this.showForm;
  }

  cancelForm(): void {
    this.changeView();
  }

  updateForm(doc: DocumentModel): void {
    this.documentPageService.updateCurrentDocument(doc);
    this.documentPageService.notify(`${doc.title} has been updated successfully!`, '', 'success');
  }

  onCallback(event: DocumentFormEvent): void {
    if (event.action === 'Updated') {
      this.updateForm(event.doc);
      this.refresh(this.redirectUrl);
    } else if (event.action === 'Canceled') {
      this.cancelForm();
    }
  }

  protected getFormSettings(): any {
    return {
      formMode: 'edit',
    };
  }

  protected getFormModels(): any[] {
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
        id: 'dc:description',
        label: 'Description',
        placeholder: 'description',
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
        id: 'app_global:UsageRights_enable_firstairing_mandatory',
        label: 'enable  First Airing Mandatory',
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
      new DynamicDragDropFileZoneModel<string>({
        id: 'file:content',
        formMode: 'edit',
        layoutPosition: 'right',
        settings: {
          queueLimit: 1,
          acceptTypes: 'image/*',
          placeholder: 'Drop Logo/Image here!',
        },
      }),
      new DynamicBatchUploadModel<string>({
        id: 'batchUpload',
        layoutPosition: 'bottom',
        formMode: 'edit',
        settings: {
          enableForm: false,
          enableAction: true,
        },
      }),
    ];
  }
}
