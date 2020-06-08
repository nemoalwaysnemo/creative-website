import { Component } from '@angular/core';
import { NbMenuItem } from '@core/nebular/theme';
import { parseTabRoute } from '@core/services/helpers';
import { DocumentDialogCustomTemplateComponent } from '../../document-dialog-custom-template.component';
import { DocumentPageService } from '../../../services/document-page.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { TAB_CONFIG } from './creative-project-asset-template-tab-config';

@Component({
  selector: 'creative-project-asset-template',
  styleUrls: ['../global-document-dialog-template.scss'],
  templateUrl: './creative-project-asset-template.component.html',
})
export class CreativeProjectAssetTemplateComponent extends DocumentDialogCustomTemplateComponent {

  static readonly NAME: string = 'creative-project-asset-template';

  tabs: any[] = parseTabRoute(TAB_CONFIG);

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected documentPageService: DocumentPageService,
  ) {
    super(globalDocumentDialogService, documentPageService);
  }

  onMenuClick(item: NbMenuItem): void {

  }

  protected onDestroy(): void {
    this.subscription.unsubscribe();
  }

}
