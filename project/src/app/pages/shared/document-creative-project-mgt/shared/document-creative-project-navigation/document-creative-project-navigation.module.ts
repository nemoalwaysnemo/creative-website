import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { GlobalSearchFormModule } from '../../../global-search-form/global-search-form.module';
import { DocumentCreativeProjectNavigationComponent } from './document-creative-project-navigation.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    GlobalSearchFormModule,
  ],
  declarations: [
    DocumentCreativeProjectNavigationComponent,
  ],
  exports: [
    DocumentCreativeProjectNavigationComponent,
  ],
})
export class DocumentCreativeProjectNavigationModule {
}
