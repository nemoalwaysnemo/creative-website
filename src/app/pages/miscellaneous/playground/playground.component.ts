import { Component, OnInit, OnChanges, OnDestroy, SimpleChanges, TemplateRef } from '@angular/core';
import { DocumentModel, DocumentRepository } from '@core/api';
import { concatMap, map } from 'rxjs/operators';
import { GlobalDocumentDialogService, OptionModel } from '../../shared';
import { DynamicSuggestionModel, DynamicInputModel, DynamicDatepickerDirectiveModel, DynamicListModel, DynamicCheckboxModel } from '@core/custom';
import { GLOBAL_DOCUMENT_DIALOG } from '../../shared/global-document-dialog';
import { SuggestionSettings } from '../../shared/directory-suggestion/directory-suggestion-settings';
import { GlobalDocumentDialogSettings } from '../../shared/global-document-dialog/global-document-dialog.interface';

@Component({
  selector: 'playground',
  templateUrl: './playground.component.html',
})
export class PlaygroundComponent implements OnInit, OnChanges, OnDestroy {

  settings: any[] = [];

  document: DocumentModel;

  dialogSettings: GlobalDocumentDialogSettings = new GlobalDocumentDialogSettings({ components: [GLOBAL_DOCUMENT_DIALOG.CUSTOM_DOWNLOAD_REQUEST] });

  constructor(private documentRepository: DocumentRepository, private globalDocumentDialogService: GlobalDocumentDialogService) {

  }

  ngOnInit(): void {
    this.load('3b3a3694-67c6-4963-bfb7-9a276b95333d');
    // this.create();
    // this.update();
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnDestroy(): void {

  }

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog);
  }

  private load(uid: string): void {
    this.documentRepository.get(uid).subscribe((doc: DocumentModel) => {
      this.document = doc;
    });
  }

  private create(): void {
    this.documentRepository.get('c4e41076-c38f-4f8a-848b-8ba45e114530').subscribe((doc: DocumentModel) => {
      this.settings = this.getSettings();
      this.document = new DocumentModel({ path: doc.uid, type: 'App-Library-Image' });
    });
  }

  private update(): void {
    this.documentRepository.get('36d9c0a8-8ed0-470e-a331-6712411da7bc/')
      .pipe(
        concatMap((parent: DocumentModel) =>
          this.documentRepository.get('d2ba1dc8-59f4-4142-a5cf-9afa626809d1').pipe(
            map((doc: DocumentModel) => {
              doc.setParent(parent);
              return doc;
            }),
          ),
        ),
      )
      .subscribe((doc: DocumentModel) => {
        this.document = doc;
        this.settings = this.getSettings();
      });
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
        hiddenFn: (doc: DocumentModel): boolean => doc.get('app_global:UsageRights'),
      }),
      new DynamicListModel({
        id: 'The_Loupe_Rights:contract_items_usage_types',
        label: 'Contract Items',
        required: false,
        items: [
          new DynamicInputModel({
            id: 'item',
            label: 'item name',
            maxLength: 50,
            placeholder: 'item',
            autoComplete: 'off',
            required: true,
            validators: {
              required: null,
              minLength: 4,
            },
            errorMessages: {
              required: '{{label}} is required',
              minLength: 'At least 4 characters',
            },
            hiddenFn: (doc: DocumentModel): boolean => doc.get('app_global:UsageRights'),
          }),
          new DynamicSuggestionModel<string>({
            id: 'media_usage_type',
            label: 'Media Usage Types',
            required: true,
            document: true,
            settings: {
              placeholder: 'Where is this used?',
              providerType: SuggestionSettings.OPERATION,
              providerName: 'javascript.provideURmediatypes',
            },
            validators: { required: null },
            errorMessages: { required: '{{label}} is required' },
            onResponsed: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
            // visibleFn: (doc: DocumentModel): boolean => doc.getParent().get('app_global:UsageRights'),
          }),
          new DynamicSuggestionModel<string>({
            id: 'contract_countries',
            label: 'Country',
            required: true,
            settings: {
              placeholder: 'Country',
              providerType: SuggestionSettings.DIRECTORY,
              providerName: 'GLOBAL_Countries',
            },
          }),
          new DynamicInputModel({
            id: 'contract_duration',
            label: 'Duration',
            placeholder: 'month',
            required: true,
            validators: { required: null, minLength: 1 },
            errorMessages: {
              required: '{{label}} is required',
              minLength: 'At least 1 characters',
            },
          }),
          new DynamicDatepickerDirectiveModel<string>({
            id: 'start_airing_date',
            label: 'Production Date',
            readonly: false,
            defaultValue: (new Date()),
            required: true,
            validators: {
              required: null,
              dateFormatValidator: null,
            },
            errorMessages: {
              required: '{{label}} is required',
              dateFormatValidator: 'Invalid {{label}}. Valid Format MMM D, YYYY',
            },
          }),
          new DynamicCheckboxModel({
            id: 'active_media_usage',
            label: 'Active',
          }),
        ],
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
