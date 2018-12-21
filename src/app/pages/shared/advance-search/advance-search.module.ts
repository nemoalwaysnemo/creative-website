import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdvanceSearchComponent } from './advance-search.component';
import { SearchDataSource } from '../services/search-data-source.service';
import { ThumbnailViewModule } from '@pages/shared/thumbnail-view/thumbnail-view.module';
import { ClickOutsideModule } from 'ng-click-outside';

const PROVIDERS = [
  SearchDataSource,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ThumbnailViewModule,
    ClickOutsideModule,
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
