import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { MiscellaneousRoutingModule, routedComponents } from './miscellaneous-routing.module';
import { SharedModule } from '@pages/shared/shared.module';
import { RedirectModule } from './redirect/redirect.module';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    RedirectModule,
    MiscellaneousRoutingModule,
  ],
  declarations: [
    ...routedComponents,
  ],
})
export class MiscellaneousModule { }
