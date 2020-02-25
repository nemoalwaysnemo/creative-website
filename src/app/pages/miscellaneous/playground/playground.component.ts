import { Component, OnInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { DocumentModel, DocumentRepository } from '@core/api';
import { DynamicSuggestionModel, DynamicInputModel, DynamicDatepickerDirectiveModel, DynamicListModel, DynamicFormArrayModel } from '@core/custom';
import { PreviewDialogService, OptionModel } from '@pages/shared';
import { SuggestionSettings } from '@pages/shared/directory-suggestion/directory-suggestion-settings';
import { concatMap, map } from 'rxjs/operators';

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
    // this.create();
    this.update();
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnDestroy(): void {

  }

  openForm(dialog: any): void {
    this.previewDialogService.open(dialog, this.document, { subDocTypes: ['App-Library-Image'] });
  }

  private create(): void {
    this.documentRepository.get('c4e41076-c38f-4f8a-848b-8ba45e114530').subscribe((doc: DocumentModel) => {
      this.settings = this.getSettings();
      this.document = new DocumentModel({ path: doc.uid, type: 'App-Library-Image' });
    });
  }

  private update(): void {
    this.documentRepository.get('b5dace6f-3042-48f8-9ef7-36e0197f1dee')
      .pipe(
        concatMap((parent: DocumentModel) =>
          this.documentRepository.get('c4724199-d769-422a-8d7b-b0351e85fb09').pipe(
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
      //   hiddenFn: (doc: DocumentModel): boolean => doc.get('app_global:UsageRights'),
      // }),
      // new DynamicFormArrayModel({
      //   id: 'formList',
      //   groupFactory: () => [
      //     new DynamicInputModel({
      //       id: 'item',
      //       label: 'item name',
      //       maxLength: 50,
      //       placeholder: 'item',
      //       autoComplete: 'off',
      //       required: true,
      //       validators: {
      //         required: null,
      //         minLength: 4,
      //       },
      //       errorMessages: {
      //         required: '{{label}} is required',
      //         minLength: 'At least 4 characters',
      //       },
      //     }),
      //   ],
      // }),
      new DynamicListModel({
        id: 'The_Loupe_Rights:contract_items_usage_types',
        label: 'Contract Items',
        required: false,
        document: true,
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
          new DynamicDatepickerDirectiveModel<string>({
            id: 'start_airing_date',
            label: 'Production Date',
            readonly: true,
            defaultValue: (new Date()),
            required: true,
            validators: { required: null },
            errorMessages: { required: '{{label}} is required' },
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
