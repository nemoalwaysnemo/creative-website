import { Component, ComponentFactoryResolver } from '@angular/core';
import { DocumentModel, UserModel } from '@core/api';
import { DynamicSuggestionModel } from '@core/custom';
import { DocumentCreativeProjectMgtBaseComponent } from '../../document-creative-project-mgt-base.component';
import { DocumentFormEvent, DocumentFormSettings } from '../../../document-form/document-form.interface';
import { GlobalDocumentDialogService } from '../../../global-document-dialog/global-document-dialog.service';
import { CreativeProjectMgtSettings } from '../../document-creative-project-mgt.interface';
import { DocumentPageService } from '../../../services/document-page.service';
import { OptionModel } from '../../../option-select/option-select.interface';
import { SuggestionSettings } from '../../../document-form-extension';
import { of as observableOf, Observable } from 'rxjs';

@Component({
  selector: 'document-creative-project-set-usage-rights',
  styleUrls: ['../../document-creative-project-mgt.component.scss'],
  templateUrl: './document-creative-project-set-usage-rights.component.html',
})
export class DocumentCreativeProjectSetUsageRightsComponent extends DocumentCreativeProjectMgtBaseComponent {

  batchDocuments: DocumentModel[];

  batchOperationSettings: DocumentFormSettings = new DocumentFormSettings({
    formMode: 'edit',
    enableBulkImport: false,
    formModel: [
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Rights:modify_contract_talent',
        label: 'Talent Contracts',
        document: true,
        required: false,
        settings: {
          placeholder: 'Select a value',
        },
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Rights:modify_contract_music',
        label: 'Music Contracts',
        document: true,
        required: false,
        settings: {
          placeholder: 'Select Music Contracts to apply.',
          providerType: SuggestionSettings.OPERATION,
          providerName: 'javascript.provideProject_UR_modify_music',
        },
        onResponse: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Rights:modify_contract_photographer',
        label: 'Photographer Contracts',
        document: true,
        required: false,
        settings: {
          placeholder: 'Select Photographer Contracts to apply.',
          providerType: SuggestionSettings.OPERATION,
          providerName: 'javascript.provideProject_UR_modify_photographer',
        },
        onResponse: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Rights:modify_contract_stock',
        label: 'Stock Contracts',
        document: true,
        required: false,
        settings: {
          placeholder: 'Select Stock Contracts to apply.',
          providerType: SuggestionSettings.OPERATION,
          providerName: 'javascript.provideProject_UR_modify_stock',
        },
        onResponse: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
      }),
    ],
  });

  constructor(
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected globalDocumentDialogService: GlobalDocumentDialogService,
  ) {
    super(documentPageService, componentFactoryResolver, globalDocumentDialogService);
  }

  protected beforeSetDocument(doc: DocumentModel, user: UserModel, formSettings: CreativeProjectMgtSettings): Observable<DocumentModel> {
    this.batchDocuments = formSettings.batchDocuments;
    this.batchDocuments.forEach((item) => {
      item.setParent(formSettings.brand);
    },
    );
    return observableOf(doc);
  }

  onCallback(event: DocumentFormEvent): void {
    if (event.action === 'Updated' || event.action === 'Canceled') {
      this.triggerChangeView('asset-home-view', 'view', new CreativeProjectMgtSettings({
        mainViewChanged: true,
        document: this.templateSettings.project,
        homeTemplate: 'creative-project-mgt-template',
        homePage: 'asset-page',
        homeView: 'asset-home-view',
      }));
    }
  }
}
