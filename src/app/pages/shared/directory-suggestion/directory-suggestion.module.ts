import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectorySuggestionComponent } from './directory-suggestion.component';
import { APIModule } from '@core/api';

@NgModule({
  imports: [
    APIModule,
    ThemeModule,
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
