import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalSearchFormModule } from '../../../global-search-form/global-search-form.module';
import { DocumentCreativeProjectNavigationComponent } from './document-creative-project-navigation.component';

@NgModule({
  imports: [
    CommonModule,
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
