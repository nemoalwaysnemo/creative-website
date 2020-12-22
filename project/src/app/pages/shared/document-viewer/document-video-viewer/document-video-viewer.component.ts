import { Component, Input, OnDestroy } from '@angular/core';
import { isValueEmpty } from '@core/services/helpers';
import { DocumentModel } from '@core/api';
import { combineLatest, Subject, Subscription } from 'rxjs';
import { DocumentVideoSettings } from './document-video-player/document-video-player.interface';

@Component({
  selector: 'document-video-viewer',
  styleUrls: ['./document-video-viewer.component.scss'],
  templateUrl: './document-video-viewer.component.html',
})
export class DocumentVideoViewerComponent implements OnDestroy {

  videoSettings: DocumentVideoSettings;

  videoSettings$: Subject<DocumentVideoSettings> = new Subject<DocumentVideoSettings>();

  document$: Subject<DocumentModel> = new Subject<DocumentModel>();

  private subscription: Subscription = new Subscription();

  @Input()
  set document(doc: DocumentModel) {
    console.log(222, doc);
    this.document$.next(doc);
  }

  @Input()
  set settings(settings: DocumentVideoSettings) {
    console.log(222, settings);
    if (!isValueEmpty(settings)) {
      this.videoSettings$.next(settings);
    }
  }

  @Input() styleName: string;

  @Input() enableStoryboard: boolean = true;

  constructor() {
    this.onDocumentChanged();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private onDocumentChanged(): void {
    console.log(312313213);

    const subscription = combineLatest([
      this.videoSettings$,
      this.document$,
    ]).subscribe(([videoSettings, doc]: [DocumentVideoSettings, DocumentModel]) => {
      this.videoSettings = videoSettings.update({
        docUid: doc.uid,
        poster: doc.videoPoster,
        videoSources: doc.getVideoSources(),
      });
      console.log(22, this.videoSettings);
    });
    this.subscription.add(subscription);
  }

}
