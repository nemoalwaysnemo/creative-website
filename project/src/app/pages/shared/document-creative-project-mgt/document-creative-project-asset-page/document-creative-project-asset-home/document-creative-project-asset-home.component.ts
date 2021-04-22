import { Component } from '@angular/core';
import { DocumentCreativeProjectMgtBaseComponent } from '../../document-creative-project-mgt-base.component';
import { ProjectMgtNavigationSettings } from '../../shared';

@Component({
  selector: 'document-creative-project-asset-home',
  styleUrls: ['../../document-creative-project-mgt.component.scss', '../document-creative-project-asset-page.component.scss'],
  templateUrl: './document-creative-project-asset-home.component.html',
})
export class DocumentCreativeProjectAssetHomeComponent extends DocumentCreativeProjectMgtBaseComponent {

  navSettings: ProjectMgtNavigationSettings = new ProjectMgtNavigationSettings();

}
