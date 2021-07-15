import { Component } from '@angular/core';
import { DocumentModel, NuxeoAutomations, UserModel } from '@core/api';
import { DynamicInputModel, DynamicDragDropFileZoneModel, DynamicBatchUploadModel, DynamicCheckboxModel } from '@core/custom';
import { GlobalDocumentFormComponent } from './global-document-form.component';
import { DocumentFormContext, DocumentFormEvent, DocumentFormSettings } from '../document-form/document-form.interface';
import { DocumentPageService } from '../services/document-page.service';
import { of as observableOf, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'creative-ring-brand-collection-form',
  template: `<document-form [user]="currentUser" [document]="document" [settings]="formSettings" [beforeSave]="beforeSave" [afterSave]="afterSave" [afterFormSave]="afterFormSave" (callback)="onCallback($event)"></document-form>`,
})
export class CreativeRingBrandCollectionFormComponent extends GlobalDocumentFormComponent {

  static readonly NAME: string = 'creative-ring-brand-collection-form';

  static readonly COMPONENT_TYPE: string = 'form';

  protected documentType: string = 'App-Library-CreativeRing-Collection';

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  afterFormSave: (ctx: DocumentFormContext) => Observable<DocumentFormContext> = (ctx: DocumentFormContext) => {
    const collection = ctx.performedDocuments[0];
    if (collection.get('app_global:enable_thumbnail')) {
      return this.documentPageService.operation(NuxeoAutomations.GenerateCollectionPoster, {}, collection.uid).pipe(
        map(_ => ctx),
      );
    } else {
      return observableOf(ctx);
    }
  }

  protected beforeOnCreation(doc: DocumentModel, user: UserModel, formSettings: DocumentFormSettings): Observable<DocumentModel> {
    return this.initializeDocument(doc, this.getDocType());
  }

  protected beforeOnCallback(event: DocumentFormEvent): Observable<DocumentFormEvent> {
    event.redirectUrl = '/p/creative/ring/brand/:uid/asset';
    return observableOf(event);
  }

  protected getFormModels(): any[] {
    return [
      new DynamicInputModel({
        id: 'dc:title',
        label: 'Brand Collection Name',
        maxLength: 150,
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
      new DynamicCheckboxModel({
        id: 'app_global:enable_thumbnail',
        label: 'Enable Thumbnail',
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'file:content',
        formMode: 'create',
        layoutPosition: 'left',
        settings: {
          queueLimit: 1,
          placeholder: 'Drop Logo here!',
          acceptTypes: 'image/*',
        },
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'file:content',
        formMode: 'edit',
        layoutPosition: 'left',
        settings: {
          queueLimit: 1,
          placeholder: 'Drop Logo here!',
          acceptTypes: 'image/*',
        },
      }),
      new DynamicBatchUploadModel<string>({
        id: 'batchUpload',
        layoutPosition: 'bottom',
        formMode: 'create',
        settings: {
          enableForm: false,
          enableAction: false,
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
