import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { ACLModule } from '@core/acl';

@NgModule({
  imports: [
    ThemeModule,
    PagesRoutingModule,
    ACLModule,
  ],
  declarations: [
    PagesComponent,
  ],
})
export class PagesModule {
}
