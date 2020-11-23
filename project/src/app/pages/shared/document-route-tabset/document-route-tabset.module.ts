import { NgModule } from '@angular/core';
import { ACLModule } from '@core/acl';
import { ThemeModule } from '@theme/theme.module';
import { DocumentRouteTabsetComponent } from './document-route-tabset.component';

@NgModule({
  imports: [
    ThemeModule,
    ACLModule,
  ],
  declarations: [
    DocumentRouteTabsetComponent,
  ],
  exports: [
    DocumentRouteTabsetComponent,
  ],
})
export class DocumentRouteTabsetModule { }
