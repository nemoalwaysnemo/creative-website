import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { DocumentBrandViewComponent } from './document-brand-view.component';

@NgModule({
  imports: [
    ThemeModule,
  ],
  declarations: [
    DocumentBrandViewComponent,
  ],
  exports: [
    DocumentBrandViewComponent,
  ],
})
export class DocumentBrandViewModule { }
