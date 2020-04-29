import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { MiscellaneousRoutingModule, routedComponents } from './miscellaneous-routing.module';
import { SharedModule } from '@pages/shared/shared.module';
import { RedirectModule } from './redirect/redirect.module';
import { GlobalDocumentDialogModule } from '@pages/shared';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    RedirectModule,
    GlobalDocumentDialogModule,
    MiscellaneousRoutingModule,
  ],
  declarations: [
    ...routedComponents,
  ],
})
export class MiscellaneousModule { }
