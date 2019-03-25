import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { MiscellaneousRoutingModule, routedComponents } from './miscellaneous-routing.module';
import { SharedModule } from '@pages/shared/shared.module';
import { DisruptionFormDayModule } from '@pages/shared/disruption-form-day/disruption-form-day.module';
import { FormDialogComponent } from './playground/form-body/form-dialog.component';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    MiscellaneousRoutingModule,
    DisruptionFormDayModule,
  ],
  declarations: [
    ...routedComponents,
    FormDialogComponent,
  ],
})
export class MiscellaneousModule { }
