import { Component, OnInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { DocumentModel, DocumentRepository } from '@core/api';
import { DynamicSuggestionModel, DynamicBatchUploadModel, DynamicInputModel } from '@core/custom';

@Component({
  selector: 'tbwa-playground',
  styleUrls: ['./playground.component.scss'],
  templateUrl: './playground.component.html',
})
export class PlaygroundComponent implements OnInit, OnChanges, OnDestroy {

  settings: any[] = [];

  parent: DocumentModel;

  document: DocumentModel;

  constructor(private documentRepository: DocumentRepository) {

  }
  ngOnInit(): void {
    this.documentRepository.get('ac90b7ae-c70c-4fa6-a7ad-5ebbd9730a91').subscribe((doc: DocumentModel) => {
      this.parent = doc;
      this.settings = this.getSettings();
      this.document = new DocumentModel({ path: this.parent.uid, type: 'App-Library-Image' });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnDestroy(): void {

  }

  private getSettings(): object[] {
    return [
      new DynamicInputModel({
        id: 'dc:title',
        label: 'Title',
        maxLength: 50,
        placeholder: 'Title',
        autoComplete: 'off',
        spellCheck: false,
        required: false,
        validators: {
          required: null,
          minLength: 4,
        },
        errorMessages: {
          required: '{{label}} is required',
        },
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:Tags_edges',
        label: '\Edges',
        directoryName: 'App-Edges-Edges',
        placeholder: 'Please select edges',
        validators: {
          required: null,
        },
        errorMessages: {
          required: '{{label}} is required.',
        },
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:Tags_edges2',
        label: 'App-Edges-Edges',
        directoryName: 'App-Edges-Edges',
        placeholder: 'Please select edges',
        suggestion: false,
      }),

      new DynamicBatchUploadModel<string>({
        id: 'uploadFiles',
        label: 'Assets',
        formMode: 'create',
        placeholder: 'Drop files here!!!',
      }),
    ];
  }

}
