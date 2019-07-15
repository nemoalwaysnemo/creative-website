import { Component, Input, ChangeDetectionStrategy} from '@angular/core';
import { NUXEO_PATH_INFO } from '@environment/environment';
import { Router } from '@angular/router';
import { DocumentModel } from '@core/api';

@Component({
  selector: 'intelligence-folder-view',
  styleUrls: ['../../../../theme/styles/disruption-folder.scss'],
  templateUrl: './intelligence-folder-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntelligenceFolderViewComponent {

  @Input() loading: boolean;

  @Input() doc: DocumentModel;

  @Input() set document(doc: DocumentModel) {
    if (doc) {
      this.doc = doc;
    }
  }

  constructor(
    private router: Router,
  ) { }

  backToParent(): void {
    const rootPath: string = NUXEO_PATH_INFO.INTELLIGENCE_BASE_FOLDER_PATH;
    const splitPath: string = this.doc.path.split(rootPath)[1];
    const childSplitPath: Array<string> = splitPath.split('/');

    if ( childSplitPath.length < 2 ) {
      this.router.navigate(['p/redirect'], { queryParams: { url: `/p/intelligence/` } });
    } else {
      this.router.navigate(['p/redirect'], { queryParams: { url: `/p/intelligence/folder/${this.doc.parentRef}` } });
    }
  }

}
