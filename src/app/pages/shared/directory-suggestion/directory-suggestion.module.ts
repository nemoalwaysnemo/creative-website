import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectorySuggestionComponent } from './directory-suggestion.component';
import { OptionSelectModule } from '../option-select/option-select.module';
import { APIModule } from '@core/api';

@NgModule({
  imports: [
    APIModule,
    ThemeModule,
    NgSelectModule,
    OptionSelectModule,
  ],
  declarations: [
    DirectorySuggestionComponent,
  ],
  exports: [
    DirectorySuggestionComponent,
  ],
})
export class DirectorySuggestionModule { }
