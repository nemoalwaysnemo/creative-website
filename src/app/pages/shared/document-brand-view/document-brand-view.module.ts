import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { DocumentBrandViewComponent } from './document-brand-view.component';
import { SharedServiceModule } from '../services/shared-service.module';

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
  providers: [
    ...SharedServiceModule.forRoot().providers,
  ],
})
export class DocumentBrandViewModule { }
