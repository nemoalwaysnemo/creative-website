import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';
import { combineLatest, Subject, Subscription } from 'rxjs';
import { DocumentViewerSettings } from './document-video-viewer/document-viewer.interface';

@Component({
  selector: 'document-viewer',
  styleUrls: ['./document-viewer.component.scss'],
  templateUrl: './document-viewer.component.html',
})
export class DocumentViewerComponent {

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.document$.next(doc);
    }
  }

  @Input()
  set settings(settings: DocumentViewerSettings) {
    this.viewerSettings$.next(settings);
  }

  viewerSettings: DocumentViewerSettings = new DocumentViewerSettings();

  private subscription: Subscription = new Subscription();

  private document$: Subject<DocumentModel> = new Subject<DocumentModel>();

  private viewerSettings$: Subject<DocumentViewerSettings> = new Subject<DocumentViewerSettings>();

  constructor() {
    this.onDocumentChanged();
  }

  getDocumentViewer(): string {
    const doc = this.viewerSettings.document;
    let type = 'unkonw';
    if (doc) {
      if (doc.isVideo()) {
        type = 'video';
      } else if (doc.isAudio()) {
        type = 'audio';
      } else if (doc.isPicture()) {
        type = 'picture';
      } else if (doc.isPdf()) {
        type = 'pdf';
      }
    }
    return type;
  }

  private onDocumentChanged(): void {
    const subscription = combineLatest([
      this.viewerSettings$,
      this.document$,
    ]).subscribe(([viewerSettings, doc]: [DocumentViewerSettings, DocumentModel]) => {
      viewerSettings.document = doc;
      this.viewerSettings.update(viewerSettings);
    });
    this.subscription.add(subscription);
  }

}
