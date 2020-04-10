import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { BackslashAssetPageComponent } from './backslash-asset-page.component';
import { SharedModule } from '@pages/shared/shared.module';
import { SharedServiceModule } from '@pages/shared';


@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    BackslashAssetPageComponent,
  ],
  providers: [
    ...SharedServiceModule.forRoot().providers,
  ],
})
export class BackslashAssetPageModule { }
