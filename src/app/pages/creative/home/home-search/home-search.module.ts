import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdvanceSearch } from '@core/api';
import { HomeSearchComponent } from './home-search.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { SharedModule } from '@pages/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ClickOutsideModule,
    SharedModule,
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
