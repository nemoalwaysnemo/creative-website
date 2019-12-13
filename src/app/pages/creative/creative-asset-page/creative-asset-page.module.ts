import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { CreativeAssetPageComponent } from './creative-asset-page.component';
import { SharedModule } from '@pages/shared/shared.module';
import { SharedServiceModule } from '@pages/shared';


@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    CreativeAssetPageComponent,
  ],
  providers: [
    ...SharedServiceModule.forRoot().providers,
  ],
})
export class CreativeAssetPageModule { }
