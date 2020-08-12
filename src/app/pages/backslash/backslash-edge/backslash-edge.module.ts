import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { BackslashEdgeComponent } from './backslash-edge.component';
import { SharedModule } from '@pages/shared/shared.module';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    BackslashEdgeComponent,
  ],
})
export class BackslashEdgeModule { }
