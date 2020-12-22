import { Component, Input, OnInit } from '@angular/core';
import { DocumentModel } from '@core/api';
import { BaseDocumentViewComponent, DocumentPageService } from '@pages/shared';
import { DocumentVideoSettings } from '@pages/shared/document-viewer/document-video-viewer/document-video-player/document-video-player.interface';

@Component({
  selector: 'learning-program-video',
  styleUrls: ['./learning-program-video.component.scss'],
  templateUrl: './learning-program-video.component.html',
})
export class LearningProgramVideoComponent extends BaseDocumentViewComponent {

  document: DocumentModel;

  show: boolean = false;

  mute: boolean = false;

  enableGlobalMute: boolean = false;

  @Input()
  set programs(programs: DocumentModel) {
    if (!!programs){
      this.document = programs;
      this.show = true;
    }
  }

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }
}
