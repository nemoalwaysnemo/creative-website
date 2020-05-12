import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { GlobalDocumentDialogModule } from '@pages/shared';
import { MiscellaneousRoutingModule } from './miscellaneous-routing.module';
import { MiscellaneousComponent } from './miscellaneous.component';
import { PlaygroundComponent } from './playground/playground.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ServerErrorComponent } from './server-error/server-error.component';
import { PermissionDeniedComponent } from './permission-denied/permission-denied.component';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    GlobalDocumentDialogModule,
    MiscellaneousRoutingModule,
  ],
  declarations: [
    MiscellaneousComponent,
    PlaygroundComponent,
    NotFoundComponent,
    ServerErrorComponent,
    PermissionDeniedComponent,
  ],
})
export class MiscellaneousModule { }
