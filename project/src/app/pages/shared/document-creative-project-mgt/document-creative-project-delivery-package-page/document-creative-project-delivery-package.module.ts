import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DocumentCreativeProjectNavigationModule, DocumentCreativeProjectRelatedAssetModule } from '../shared';
import { ListSearchFormInDialogModule } from '../../list-search-form-in-dialog';
import { DocumentFormModule } from '../../document-form/document-form.module';
import { DocumentCreativeProjectDeliveryPackagePageComponent } from './document-creative-project-delivery-package-page.component';
import { DocumentCreativeProjectDeliveryPackageHomeComponent } from './document-creative-project-delivery-package-home/document-creative-project-delivery-package-home.component';
import { DocumentListViewModule } from '../../document-list-view/document-list-view.module';
import { DocumentCreativeProjectAssetPackageSendModule } from './document-creative-project-asset-package-send/document-creative-project-asset-package-send.module';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    DocumentFormModule,
    DocumentListViewModule,
    ListSearchFormInDialogModule,
    DocumentCreativeProjectNavigationModule,
    DocumentCreativeProjectRelatedAssetModule,
    DocumentCreativeProjectAssetPackageSendModule,
  ],
  declarations: [
    DocumentCreativeProjectDeliveryPackagePageComponent,
    DocumentCreativeProjectDeliveryPackageHomeComponent,
  ],
})
export class DocumentCreativeProjectDeliveryPackageModule {
}
