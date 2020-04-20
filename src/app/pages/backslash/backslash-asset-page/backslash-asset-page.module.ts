import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { BackslashAssetPageComponent } from './backslash-asset-page.component';
import { SharedModule } from '@pages/shared/shared.module';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    BackslashAssetPageComponent,
  ],
})
export class BackslashAssetPageModule { }
