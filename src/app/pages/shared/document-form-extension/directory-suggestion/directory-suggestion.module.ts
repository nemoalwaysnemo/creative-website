import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { APIModule } from '@core/api';
import { DirectorySuggestionComponent } from './directory-suggestion.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    APIModule,
    FormsModule,
    CommonModule,
    NgSelectModule,
  ],
  declarations: [
    DirectorySuggestionComponent,
  ],
  exports: [
    DirectorySuggestionComponent,
  ],
})
export class DirectorySuggestionModule { }
