import { Component, HostListener, Input } from '@angular/core';
import { DocumentModel } from '@core/api';
import { BehaviorSubject, Subscription } from 'rxjs';
import { DocumentDialogCustomTemplateComponent } from './document-dialog-custom-template.component';
import { GlobalDocumentDialogService } from './global-document-dialog.service';
import { DocumentPageService } from '../services/document-page.service';

@Component({
  template: '',
})
export class DocumentDialogPreviewTemplateComponent extends DocumentDialogCustomTemplateComponent {

  @HostListener('window:keyup', ['$event'])
  keyUpEvent(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft' && this.hasPrev()) {
      this.prev();
    } else if (event.key === 'ArrowRight' && this.hasNext()) {
      this.next();
    }
  }

  @Input()
  set metadata(metadata: any) {
    if (metadata) {
      this.dialogSettings = Object.assign({}, this.dialogSettings, this.getPreviewSettings(), metadata);
    }
  }

  @Input()
  set documents(docs: DocumentModel[]) {
    if (docs && docs.length > 0) {
      this.documents$.next(docs);
    }
  }

  enableGallery: boolean = false;

  currentDocIndex: number = -1;

  protected dialogSettings: any = {
    docViewerLayout: 'dialogSlides',
  };

  protected documents$: BehaviorSubject<DocumentModel[]> = new BehaviorSubject<DocumentModel[]>([]);

  protected subscription: Subscription = new Subscription();

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected documentPageService: DocumentPageService,
  ) {
    super(globalDocumentDialogService, documentPageService);
    this.subscribeDialogEvents();
  }

  prev(): void {
    this.refreshView(this.getSelectedDocument(this.getIndex(false)), this.dialogSettings);
  }

  next(): void {
    this.refreshView(this.getSelectedDocument(this.getIndex(true)), this.dialogSettings);
  }

  hasPrev(): boolean {
    return this.enableGallery && this.currentDocIndex > 0;
  }

  hasNext(): boolean {
    return this.enableGallery && this.currentDocIndex >= 0 && this.currentDocIndex < this.documents$.value.length - 1;
  }

  protected getPreviewSettings(): any {
    return {};
  }

  protected subscribeDialogEvents(): void {
    // this.subscribeDialogBuiltInEvents();
    this.onDocumentsChanged();
  }

  protected onDocumentsChanged(): void {
    const subscription = this.documents$.subscribe((docs: DocumentModel[]) => {
      this.performGallerySettings(docs);
    });
    this.subscription.add(subscription);
  }

  protected refreshView(document: DocumentModel, metadata: any = {}): void {
    if (document) {
      this.globalDocumentDialogService.refreshView(document, metadata);
    }
  }

  protected performGallerySettings(docs: DocumentModel[]): void {
    if (docs && docs.length > 0) {
      this.enableGallery = true;
      this.currentDocIndex = docs.findIndex((d: DocumentModel) => d.uid === this.document.uid);
    } else {
      this.enableGallery = false;
      this.currentDocIndex = -1;
    }
  }

  protected getSelectedDocument(i: number): DocumentModel {
    return this.documents$.value[i] ? this.documents$.value[i] : null;
  }

  private getIndex(next: boolean): number {
    if (!next && this.hasPrev()) {
      this.currentDocIndex = this.currentDocIndex - 1;
    } else if (next && this.hasNext()) {
      this.currentDocIndex = this.currentDocIndex + 1;
    }
    return this.currentDocIndex;
  }
}
