import { Component, Input, Type, TemplateRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentModel, NuxeoPermission } from '@core/api';
import { combineLatest, Observable, of as observableOf, Subject, Subscription } from 'rxjs';
import { GlobalDocumentDialogService, DocumentModelForm } from '../../../shared';
import { GLOBAL_DOCUMENT_FORM } from '../../../shared/global-document-form';
import { GlobalDocumentDialogSettings } from '../../../shared/global-document-dialog';

@Component({
  selector: 'creative-ring-form-button',
  styleUrls: ['./creative-ring-form-button.component.scss'],
  templateUrl: './creative-ring-form-button.component.html',
})
export class CreativeRingFormButtonComponent implements OnDestroy {

  document: DocumentModel;

  dialogSettings: GlobalDocumentDialogSettings;

  addChildrenPermission$: Observable<boolean> = observableOf(false);

  redirectUrl: string = this.router.url;

  @Input() title: string;

  @Input()
  set type(type: string) {
    this.dialogSettings$.next(type);
  }

  @Input()
  set parent(doc: DocumentModel) {
    if (doc) {
      this.document$.next(doc);
      this.addChildrenPermission$ = doc.hasPermission(NuxeoPermission.AddChildren);
    }
  }

  private dialogSettings$: Subject<any> = new Subject<any>();

  private document$: Subject<DocumentModel> = new Subject<DocumentModel>();

  private subscription: Subscription = new Subscription();

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    private router: Router,
  ) {
    this.onDocumentChanged();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog, { closeOnBackdropClick: false });
  }

  protected onDocumentChanged(): void {
    const subscription = combineLatest([
      this.document$,
      this.dialogSettings$,
    ]).subscribe(([doc, type]: [DocumentModel, any]) => {
      this.document = doc;
      this.dialogSettings = this.getDialogFormSettings(type, doc);
    });
    this.subscription.add(subscription);
  }

  private getDialogFormSettings(type: string, doc: DocumentModel): GlobalDocumentDialogSettings {
    const components: Type<DocumentModelForm>[] = [];
    switch (type) {
      case 'collection':
        components.push(GLOBAL_DOCUMENT_FORM.CREATIVE_RING_COLLECTION_FORM);
        break;
      case 'upload-collection':
        components.push(GLOBAL_DOCUMENT_FORM.CREATIVE_RING_UPLOAD_COLLECTION_FORM);
        break;
      default:
        throw new Error(`unknown document form component for '${type}'`);
    }
    return new GlobalDocumentDialogSettings({
      containerLayout: 'middle-dialog-container',
      components,
      metadata: {
        formSettings: { formType: 'new', collectionType: doc.get('The_Loupe_Main:collection_type'), collectionName: doc.title },
      },
    });
  }

}
