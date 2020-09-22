import { Component } from '@angular/core';
import { CreativeProjectAssetBaseTemplateComponent } from '../creative-project-asset-base-template.component';

@Component({
  selector: 'creative-project-asset-deliverable-template',
  styleUrls: ['../creative-project-asset-template.scss'],
  templateUrl: './creative-project-asset-deliverable-template.component.html',
})
export class CreativeProjectAssetDeliverableTemplateComponent extends CreativeProjectAssetBaseTemplateComponent {

  listViewOptionsAsset: any = {
    deliverPackage: false,
  };

  listViewOptionsPackage: any = {
    hideHeader: false,
    selectMode: 'multi',
    deliverPackage: true,
  };

  onResponse(refresh: boolean): void {
    if (refresh) {
      this.listViewOptionsPackage = {
        hideHeader: false,
        selectMode: 'multi',
        deliverPackage: true,
      };
    }
  }

  protected onInit(): void {
  }
}
