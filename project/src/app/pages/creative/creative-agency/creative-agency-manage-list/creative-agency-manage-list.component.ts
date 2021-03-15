import { Component } from '@angular/core';
import { DocumentModel, UserModel } from '@core/api';
import { ActivatedRoute } from '@angular/router';
import { BaseDocumentManageComponent, DocumentPageService } from '@pages/shared';
import { DynamicSuggestionModel, DynamicOptionTagModel, DynamicDragDropFileZoneModel, DynamicBatchUploadModel, DynamicCheckboxModel } from '@core/custom';
import { DocumentFormEvent, DocumentFormSettings } from '../../../shared/document-form/document-form.interface';
import { SuggestionSettings } from '../../../shared/document-form-extension';

@Component({
  selector: 'creative-agency-manage-list',
  styleUrls: ['./creative-agency-manage-list.component.scss'],
  templateUrl: './creative-agency-manage-list.component.html',
})
export class CreativeAgencyManageListComponent extends BaseDocumentManageComponent {

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
      new DynamicOptionTagModel({
        id: 'The_Loupe_Main:brand',
        label: 'Brand',
        placeholder: 'Brand',
        required: false,
        visibleFn: (doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): boolean => doc.get('app_global:brand_activation'),
      }),
      new DynamicOptionTagModel<string>({
        id: 'The_Loupe_Main:region',
        label: 'Regions',
        placeholder: 'Select a value',
        required: false,
        visibleFn: (doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): boolean => doc.get('app_global_fields:enable_region'),
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:library_librarians',
        label: 'Librarians/Download Approvers',
        settings: {
          initSearch: false,
          placeholder: 'Select a value',
          providerType: SuggestionSettings.USER_GROUP,
        },
        visibleFn: (doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): boolean => user.isAdmin(),
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:library_owners',
        label: 'Library Owners',
        settings: {
          initSearch: false,
          placeholder: 'Select a value',
          providerType: SuggestionSettings.USER_GROUP,
        },
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Rights:asset_countries',
        label: 'Default Asset Country',
        settings: {
          placeholder: 'Select default country for all new assets in this library.',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Countries',
        },
      }),
      new DynamicCheckboxModel({
        id: 'app_global:UsageRights_enable_firstairing_mandatory',
        label: 'Make First Airing Mandatory',
        visibleFn: (doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): boolean => doc.get('app_global:UsageRights'),
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Rights:contract_mediatypes',
        label: 'Usage Rights Media Usage Types',
        settings: {
          placeholder: 'Media Usage Types available for all assets in this library folder',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Library-UR-contract-mediatypes',
        },
        visibleFn: (doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): boolean => doc.get('app_global:UsageRights'),
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:assettypes_image',
        label: 'Image Asset Types',
        settings: {
          parentOnly: true,
          placeholder: 'Select a value',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Library-MediaTypes-Image',
        },
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:assettypes_video',
        label: 'Video Asset Types',
        settings: {
          placeholder: 'Select a value',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Library-MediaTypes-Video',
        },
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:assettypes_audio',
        label: 'Audio Asset Types',
        settings: {
          placeholder: 'Select a value',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Library-MediaTypes-Audio',
        },
      }),
      new DynamicOptionTagModel<string>({
        id: 'The_Loupe_Main:productModel',
        label: 'Products',
        placeholder: 'Please add product',
        required: false,
        visibleFn: (doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): boolean => doc.get('app_global_fields:enable_productlist'),
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'dragDropAssetZone',
        formMode: 'edit',
        layoutPosition: 'right',
        settings: {
          queueLimit: 1,
          xpath: 'file:content',
          placeholder: 'Drop Logo/Image here!',
          acceptTypes: 'image/*',
        },
      }),
      new DynamicBatchUploadModel<string>({
        id: 'files:files',
        layoutPosition: 'bottom',
        formMode: 'edit',
        settings: {
          showInput: false,
          multiUpload: true,
        },
      }),
    ];
  }
}
