import { Component, Input, ChangeDetectionStrategy} from '@angular/core';
import { Router } from '@angular/router';
import { DocumentModel } from '@core/api';

@Component({
  selector: 'intelligence-folder-view',
  styleUrls: ['./intelligence-folder-view.component.scss'],
  templateUrl: './intelligence-folder-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntelligenceFolderViewComponent {

  folderType: string[] = ['App-Intelligence-Consumer-Folder', 'App-Intelligence-Industry-Folder', 'App-Intelligence-Marketing-Folder', 'App-Intelligence-Brands-Folder'];

  isShow: boolean = false;

  @Input() loading: boolean;

  @Input() doc: DocumentModel;

  @Input() set document(doc: DocumentModel) {
    if (doc) {
      this.doc = doc;
      this.isShow = this.showBackToParent(doc.type);
    }
  }

  constructor(
    private router: Router,
  ) { }

  showBackToParent(type: string): boolean {
    return this.folderType.indexOf(type) < 0 ? true : false;
  }

  backToParent(): void {
    this.router.navigate(['p/redirect'], { queryParams: { url: `/p/intelligence/folder/${this.doc.parentRef}` } });
  }

}
