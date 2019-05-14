import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { RedirectComponent, RedirectBodyComponent } from './redirect.component';
import { Routes, RouterModule } from '@angular/router';
import { RedirectRoutingModule } from './redirect.routing.module';

@NgModule({
  imports: [
    ThemeModule,
    RedirectRoutingModule,
  ],
  exports: [RouterModule],
  declarations: [RedirectComponent, RedirectBodyComponent],
})

export class RedirectModule { }
