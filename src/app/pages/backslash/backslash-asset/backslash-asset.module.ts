import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { BackslashAssetComponent } from './backslash-asset.component';
import { SharedModule } from '@pages/shared/shared.module';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    BackslashAssetComponent,
  ],
})
export class BackslashAssetModule { }
