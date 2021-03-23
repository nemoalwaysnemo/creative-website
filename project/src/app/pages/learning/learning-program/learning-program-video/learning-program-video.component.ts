import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';
import { BaseDocumentViewComponent, DocumentPageService } from '@pages/shared';

@Component({
  selector: 'learning-program-video',
  styleUrls: ['./learning-program-video.component.scss'],
  templateUrl: './learning-program-video.component.html',
})
export class LearningProgramVideoComponent extends BaseDocumentViewComponent {

  document: DocumentModel;

  viewerSettings: any = {
    enableGlobalMute: false,
    mute: false,
    autoplay: false,
  };

  @Input()
  set programs(doc: DocumentModel) {
    if (doc) {
      this.document = doc;
    }
  }

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }
}
