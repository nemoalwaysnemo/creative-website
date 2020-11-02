import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { BusinessDevelopmentSearchComponent } from './business-development-search.component';
import { BusinessDevelopmentSearchRoutingModule } from './business-development-search-routing.module';
import { BizDevDocumentAssetSearchComponent } from './biz-dev-document-asset-search/biz-dev-document-asset-search.component';

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    BusinessDevelopmentSearchRoutingModule,
  ],
  declarations: [
    BusinessDevelopmentSearchComponent,
    BizDevDocumentAssetSearchComponent,
  ],
})
export class BusinessDevelopmentSearchModule {
}
