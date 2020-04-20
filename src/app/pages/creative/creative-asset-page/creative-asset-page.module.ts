import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { CreativeAssetPageComponent } from './creative-asset-page.component';
import { SharedModule } from '@pages/shared/shared.module';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    CreativeAssetPageComponent,
  ],
})
export class CreativeAssetPageModule { }
