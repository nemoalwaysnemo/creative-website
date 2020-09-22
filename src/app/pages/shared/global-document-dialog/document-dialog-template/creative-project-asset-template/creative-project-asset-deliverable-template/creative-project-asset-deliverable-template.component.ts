import { Component } from '@angular/core';
import { CreativeProjectAssetBaseTemplateComponent } from '../creative-project-asset-base-template.component';

@Component({
  selector: 'creative-project-asset-deliverable-template',
  styleUrls: ['../creative-project-asset-template.scss'],
  templateUrl: './creative-project-asset-deliverable-template.component.html',
})
export class CreativeProjectAssetDeliverableTemplateComponent extends CreativeProjectAssetBaseTemplateComponent {

  selectedAsset = false;
  selectedNew = false;
  selectedDelivery = false;

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
    console.log(44444, this.settings);
    const selectedTitle: string = this.settings.selectedTab;
    switch (selectedTitle) {
      case 'Asset':
        this.selectedAsset = true;
        break;
      case 'New Package':
        this.selectedNew = true;
        break;
      case 'Delivery Package':
        this.selectedDelivery = true;
        break;
    }
  }
}
