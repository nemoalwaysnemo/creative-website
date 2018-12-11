import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeSearchComponent } from './home-search.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    HomeSearchComponent,
  ],
  declarations: [
    HomeSearchComponent,
  ],
})
export class HomeSearchModule {}
