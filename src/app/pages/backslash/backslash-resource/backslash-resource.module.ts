import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { BackslashResourceComponent } from './backslash-resource.component';
import { SharedModule } from '@pages/shared/shared.module';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    BackslashResourceComponent,
  ],
})
export class BackslashResourceModule { }
