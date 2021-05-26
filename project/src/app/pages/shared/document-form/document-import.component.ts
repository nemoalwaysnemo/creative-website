import { Component } from '@angular/core';
import { AdvanceSearchService, DocumentModel, NuxeoUploadResponse, UserModel } from '@core/api';
import { DynamicBatchUploadModel, DynamicDragDropFileZoneModel, DynamicFormControlModel, DynamicFormModel, DynamicFormService } from '@core/custom';
import { DynamicNGFormSettings } from '../document-form-extension/dynamic-ng-form';
import { BaseDocumentFormComponent } from './base-document-form.component';
import { DocumentPageService } from '../services/document-page.service';
import { DocumentFormSettings } from './document-form.interface';
import { forkJoin, Observable, of as observableOf } from 'rxjs';
import { concatMap, map, tap } from 'rxjs/operators';

@Component({
  selector: 'document-import',
  styleUrls: ['./document-form.component.scss'],
  templateUrl: './document-import.component.html',
})
export class DocumentImportComponent extends BaseDocumentFormComponent {

  constructor(
    protected formService: DynamicFormService,
    protected advanceSearchService: AdvanceSearchService,
    protected documentPageService: DocumentPageService,
  ) {
    super(formService, advanceSearchService);
  }

  protected onUploadFileSelected(uploadModel: DynamicFormControlModel, settings: DynamicNGFormSettings, res: NuxeoUploadResponse[]): void {

  }

  protected performDocumentForm(doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): void {
    const models = this.getImportFormModel(settings);
    this.performNgFormSettings(doc, user, settings, models);
    this.createDocumentForm(models);
  }

  protected performNgFormSettings(doc: DocumentModel, user: UserModel, settings: DocumentFormSettings, models: DynamicFormModel): void {
    const ngFormSettings = new DynamicNGFormSettings();
    ngFormSettings.formModel = this.createFormModel(models);
    ngFormSettings.formMode = settings.formMode;
    ngFormSettings.enableLayoutRight = false;
    this.ngFormSettings = ngFormSettings;
  }

  protected getImportFormModel(settings: DocumentFormSettings): DynamicFormModel {
    return [
      new DynamicDragDropFileZoneModel<string>({
        id: 'file:content',
        formMode: 'create',
        settings: {
          xpath: 'file:content',
          queueLimit: settings.importSettings.queueLimit,
          placeholder: settings.importSettings.placeholder,
          acceptTypes: settings.importSettings.acceptTypes,
        },
      }),
      new DynamicBatchUploadModel<string>({
        id: 'batchUpload',
        formMode: 'create',
        settings: {
          enableForm: true,
          enableAction: true,
          onFilesChangedFn: this.onFilesChangedFn.bind(this),
        },
      }),
    ];
  }

  protected onFilesChangedFn(items: NuxeoUploadResponse[]): Observable<NuxeoUploadResponse[]> {
    return this.initializeImportFormModels(this.currentDocument, this.formSettings, items);
  }

  protected initializeImportFormModel(parent: DocumentModel, settings: DocumentFormSettings, item: NuxeoUploadResponse): Observable<NuxeoUploadResponse> {
    return (settings.importSettings.initializeDocument ? this.initializeDocument(parent, settings, item) : observableOf(parent.newInstance(settings.importSettings.getDocType(item)))).pipe(
      map((doc: DocumentModel) => {
        if (!item.formModel) {
          item.formModel = this.performFormModel(doc, this.currentUser, settings);
        }
        return item;
      }),
    );
  }

  protected initializeImportFormModels(parent: DocumentModel, settings: DocumentFormSettings, items: NuxeoUploadResponse[]): Observable<NuxeoUploadResponse[]> {
    return forkJoin(items.map((res: NuxeoUploadResponse) => this.initializeImportFormModel(parent, settings, res)));
  }

  protected initializeDocument(parent: DocumentModel, settings: DocumentFormSettings, item: NuxeoUploadResponse): Observable<DocumentModel> {
    return this.documentPageService.initializeDocument(parent, settings.importSettings.getDocType(item));
  }

}
