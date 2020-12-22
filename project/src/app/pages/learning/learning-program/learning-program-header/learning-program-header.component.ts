import { Component, Input } from '@angular/core';
import { DocumentModel} from '@core/api';
import { BaseDocumentViewComponent, DocumentPageService } from '@pages/shared';

@Component({
  selector: 'learning-program-header',
  styleUrls: ['./learning-program-header.component.scss'],
  templateUrl: './learning-program-header.component.html',
})
export class LearningProgramHeaderComponent extends BaseDocumentViewComponent {

  loading: boolean = true;

  src: string;

  @Input() set programs(programs: DocumentModel) {
    if (!!programs){
      this.src = programs.get('app_Learning:program_banner').data;
      this.loading = false;
    }
  }

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

}
