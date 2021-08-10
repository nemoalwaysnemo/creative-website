import { Component, Input } from '@angular/core';
import { DocumentModel, NuxeoPermission, NuxeoAutomations } from '@core/api';
import { Observable, of as observableOf, combineLatest, Subscription, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DocumentPageService } from '../services/document-page.service';
import { DocumentVideoViewerService, DocumentVideoEvent } from '../document-viewer';

@Component({
  selector: 'document-new-poster-button',
  styleUrls: ['./document-new-poster-button.component.scss'],
  templateUrl: './document-new-poster-button.component.html',
})
export class DocumentNewPosterButtonComponent {

  videoCurrentTime: number | null = null;

  writePermission$: Observable<boolean> = observableOf(false);

  private document$: Subject<DocumentModel> = new Subject<DocumentModel>();

  private documentModel: DocumentModel;

  private subscription: Subscription = new Subscription();

  @Input() enable: boolean = false;

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.documentModel = doc;
      this.document$.next(doc);
      this.writePermission$ = doc.hasPermission(NuxeoPermission.Write);
    }
  }

  constructor(
    private documentPageService: DocumentPageService,
    private documentVideoViewerService: DocumentVideoViewerService,
  ) {
    this.subscribeServiceEvent();
  }

  newThumbnail(currentTime: number): void {
    if (typeof currentTime === 'number') {
      const duration = (currentTime * 10).toString();
      const subscription = this.documentPageService.operation(NuxeoAutomations.GetVideoScreenshot, { duration }, this.documentModel.uid).subscribe((doc: DocumentModel) => {
        this.documentPageService.notify('Video poster has been updated successfully!', '', 'success');
        this.documentPageService.refresh(500);
      });
      this.subscription.add(subscription);
    }
  }

  protected subscribeServiceEvent(): void {
    const subscription = combineLatest([
      this.document$,
      this.documentVideoViewerService.onEvent().pipe(
        filter((e: DocumentVideoEvent) => this.enable && ['videoPause', 'videoSeeking', 'videoTimeUpdate'].includes(e.name)),
      ),
    ]).pipe(
      filter(([doc, event]: [DocumentModel, DocumentVideoEvent]) => event.docUid === doc.uid),
    ).subscribe(([doc, e]: [DocumentModel, DocumentVideoEvent]) => {
      this.videoCurrentTime = e.currentTime;
    });
    this.subscription.add(subscription);
  }
}
