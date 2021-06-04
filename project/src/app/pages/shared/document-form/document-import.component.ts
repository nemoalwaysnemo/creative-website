import { Component } from '@angular/core';
import { DocumentModel, NuxeoUploadResponse, UserModel } from '@core/api';
import { DynamicBatchUploadModel, DynamicDragDropFileZoneModel, DynamicFormControlModel, DynamicFormModel, DynamicFormService } from '@core/custom';
import { DynamicNGFormSettings } from '../document-form-extension/dynamic-ng-form';
import { BaseDocumentFormComponent } from './base-document-form.component';
import { DocumentPageService } from '../services/document-page.service';
import { DocumentFormSettings } from './document-form.interface';
import { forkJoin, Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'document-import',
  styleUrls: ['./document-form.component.scss'],
  templateUrl: './document-import.component.html',
})
export class DocumentImportComponent extends BaseDocumentFormComponent {

  protected formName: string = 'document-import-form';

  constructor(
    protected formService: DynamicFormService,
    protected documentPageService: DocumentPageService,
  ) {
    super(documentPageService, formService);
  }

  protected onUploadFileSelected(uploadModel: DynamicFormControlModel, settings: DynamicNGFormSettings, res: NuxeoUploadResponse[]): void {

  }

  protected performSharedFormModel(doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): DynamicFormModel {
    const sharedModels = this.getImportFormModel(settings);
    const models = sharedModels.filter((v) => v.formMode === null || v.formMode === settings.formMode).filter((m: DynamicFormControlModel) => !m.visibleFn || m.visibleFn(doc, user, settings));
    return this.prepareFormModel(doc, user, settings, models);
  }

  protected performDocumentForm(doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): void {
    settings.enableBulkImport = true;
    const models = this.performSharedFormModel(doc, user, settings);
    this.performNgFormSettings(doc, user, settings, models);
    this.createDocumentForm(models);
  }

  protected performNgFormSettings(doc: DocumentModel, user: UserModel, settings: DocumentFormSettings, models: DynamicFormModel): void {
    const ngFormSettings = new DynamicNGFormSettings();
    ngFormSettings.formModel = this.createFormModel(models);
    ngFormSettings.enableLayoutRight = settings.enableLayoutRight;
    ngFormSettings.formMode = settings.formMode;
    ngFormSettings.enableWideHorizontal = true;
    this.ngFormSettings = ngFormSettings;
  }

  protected getImportFormModel(settings: DocumentFormSettings): DynamicFormModel {
    const importModel = [
      new DynamicDragDropFileZoneModel<string>({
        id: 'file:content',
        formMode: 'create',
        settings: {
          xpath: 'file:content',
          queueLimit: settings.importSettings.queueLimit,
          placeholder: settings.importSettings.placeholder,
          acceptTypes: settings.importSettings.acceptTypes,
          dragZoneStyle: {height: '100px'},
          placeholderClass: {height: '40px', margin: '30px auto'},
        },
        layoutPosition: settings.importSettings.layoutPosition,
      }),
      new DynamicBatchUploadModel<string>({
        id: 'batchUpload',
        formMode: 'create',
        settings: {
          enableForm: true,
          enableAction: true,
          onFilesChangedFn: this.onFilesChangedFn.bind(this),
          arrangeDirection: 'horizontal',
        },
        layoutPosition: settings.importSettings.layoutPosition,
      }),
    ];
    return (settings.sharedModel || []).concat(importModel);
  }

  protected onFilesChangedFn(items: NuxeoUploadResponse[]): Observable<NuxeoUploadResponse[]> {
    return this.initializeImportFormModels(this.currentDocument, this.formSettings, items);
  }

  protected initializeImportFormModel(parent: DocumentModel, settings: DocumentFormSettings, item: NuxeoUploadResponse): Observable<NuxeoUploadResponse> {
    return (settings.importSettings.initializeDocument ? this.initializeDocument(parent, settings, item) : observableOf(parent.newInstance(this.getDocType(settings, item)))).pipe(
      map((doc: DocumentModel) => {
        if (!item.formModel) {
          item.document = doc;
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
    return this.documentPageService.initializeDocument(parent, this.getDocType(settings, item));
  }

  protected getDocType(settings: DocumentFormSettings, item: NuxeoUploadResponse): string {
    const type = settings.importSettings.getDocType(item);
    if (!type) {
      throw new Error(`unknown document type for '${item.fileName}'`);
    }
    return type;
  }

}
