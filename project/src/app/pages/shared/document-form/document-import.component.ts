import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DocumentModel, NuxeoUploadResponse } from '@core/api';
import { DynamicBatchUploadModel, DynamicDragDropFileZoneModel, DynamicFormModel, DynamicFormService } from '@core/custom';
import { DynamicNGFormSettings } from '../document-form-extension/dynamic-ng-form';
import { BaseDocumentFormComponent } from './base-document-form.component';
import { DocumentPageService } from '../services/document-page.service';
import { DocumentFormContext, DocumentFormSettings } from './document-form.interface';
import { forkJoin, Observable, of as observableOf, timer } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'document-import',
  styleUrls: ['./document-form.component.scss'],
  templateUrl: './document-import.component.html',
})
export class DocumentImportComponent extends BaseDocumentFormComponent {

  sharedGroup: FormGroup;

  sharedFormSettings: DynamicNGFormSettings;

  constructor(
    protected formService: DynamicFormService,
    protected documentPageService: DocumentPageService,
  ) {
    super(documentPageService, formService);
  }

  protected performDocumentForm(ctx: DocumentFormContext): void {
    const models = this.getImportFormModel(ctx.formSettings);
    this.prepareDocumentForm(ctx, models);
    this.performSharedDocumentForm(ctx);
  }

  protected performSharedDocumentForm(ctx: DocumentFormContext): void {
    ctx.formSettings.enableBulkImport = true;
    const models = this.performFormModel(ctx, ctx.formSettings.sharedModel);
    this.performSharedFormSettings(ctx, models);
    this.createSharedDocumentForm(models);
  }

  protected createSharedDocumentForm(models: DynamicFormModel): void {
    this.sharedGroup = this.createFormGroup(models);
    // const subscription = this.sharedGroup.statusChanges.subscribe((valid: any) => {
    //   timer(0).subscribe(() => { this.updateFormStatus({ formValid: valid === 'VALID', submitted: false }); });
    // });
    // this.subscription.add(subscription);
  }

  protected performNgFormSettings(ctx: DocumentFormContext, formModel: DynamicFormModel): void {
    const ngFormSettings = new DynamicNGFormSettings();
    ngFormSettings.formModel = this.createFormModel(formModel);
    ngFormSettings.enableLayoutRight = ctx.formSettings.enableLayoutRight;
    ngFormSettings.formMode = ctx.formSettings.formMode;
    ngFormSettings.enableWideHorizontal = true;
    this.ngFormSettings = ngFormSettings;
  }

  protected performSharedFormSettings(ctx: DocumentFormContext, formModel: DynamicFormModel): void {
    const ngFormSettings = new DynamicNGFormSettings();
    ngFormSettings.formModel = this.createFormModel(formModel);
    ngFormSettings.formMode = ctx.formSettings.formMode;
    ngFormSettings.enableLayoutRight = false;
    this.sharedFormSettings = ngFormSettings;
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
          dragZoneStyle: { height: '100px' },
          placeholderClass: { height: '40px', margin: '30px auto' },
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
    return (settings.formModel || []).concat(importModel);
  }

  protected onFilesChangedFn(items: NuxeoUploadResponse[]): Observable<NuxeoUploadResponse[]> {
    return this.initializeImportFormModels(this.ctx, items);
  }

  protected initializeImportFormModel(ctx: DocumentFormContext, item: NuxeoUploadResponse): Observable<NuxeoUploadResponse> {
    return (ctx.formSettings.importSettings.initializeDocument ? this.initializeDocument(ctx, item) : observableOf(ctx.currentDocument.newInstance(this.getDocType(ctx.formSettings, item)))).pipe(
      map((doc: DocumentModel) => {
        if (!item.formModel) {
          item.document = doc;
          item.formModel = this.performFormModel(ctx, ctx.formSettings.importModel);
        }
        return item;
      }),
    );
  }

  protected initializeImportFormModels(ctx: DocumentFormContext, items: NuxeoUploadResponse[]): Observable<NuxeoUploadResponse[]> {
    return forkJoin(items.map((res: NuxeoUploadResponse) => this.initializeImportFormModel(ctx, res)));
  }

  protected initializeDocument(ctx: DocumentFormContext, item: NuxeoUploadResponse): Observable<DocumentModel> {
    return this.documentPageService.initializeDocument(ctx.currentDocument, this.getDocType(ctx.formSettings, item));
  }

  protected getDocType(settings: DocumentFormSettings, item: NuxeoUploadResponse): string {
    const type = settings.importSettings.getDocType(item);
    if (!type) {
      throw new Error(`unknown document type for '${item.fileName}'`);
    }
    return type;
  }

}
