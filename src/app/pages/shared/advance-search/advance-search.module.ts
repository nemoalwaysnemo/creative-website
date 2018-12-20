import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdvanceSearchComponent } from './advance-search.component';
import { SearchDataSource } from '../shared-service/search-data-source.service';
import { ThumbnailViewModule } from '@pages/shared/thumbnail-view/thumbnail-view.module';

const PROVIDERS = [
  SearchDataSource,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ThumbnailViewModule,
  ],
  exports: [
    AdvanceSearchComponent,
  ],
  declarations: [
    AdvanceSearchComponent,
  ],
})
export class AdvanceSearchModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: AdvanceSearchModule,
      providers: [
        ...PROVIDERS,
      ],
    };
  }

}
