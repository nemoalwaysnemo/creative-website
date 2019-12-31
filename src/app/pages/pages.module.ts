import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { BackslashPageComponent } from './backslash/backslash-page.component';

@NgModule({
  imports: [
    ThemeModule,
    PagesRoutingModule,
  ],
  declarations: [
    PagesComponent,
    BackslashPageComponent,
  ],
})
export class PagesModule {
}
