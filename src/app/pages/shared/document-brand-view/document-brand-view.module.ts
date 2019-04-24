import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbSpinnerModule } from '@core/nebular/theme';
import { DocumentBrandViewComponent } from './document-brand-view.component';
import { SharedServiceModule } from '../services/shared-service.module';

@NgModule({
  imports: [
    CommonModule,
    NbSpinnerModule,
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
