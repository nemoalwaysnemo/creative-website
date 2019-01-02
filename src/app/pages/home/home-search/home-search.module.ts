import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeSearchComponent } from './home-search.component';
import { AdvanceSearch } from '@pages/shared/services/advance-search.service';
import { ThumbnailViewModule } from '@pages/shared/thumbnail-view/thumbnail-view.module';
import { ClickOutsideModule } from 'ng-click-outside';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ThumbnailViewModule,
    ClickOutsideModule,
  ],
  declarations: [
    HomeSearchComponent,
  ],
  exports: [
    HomeSearchComponent,
  ],
  providers: [
    AdvanceSearch,
  ],
})
export class HomeSearchModule {

}
