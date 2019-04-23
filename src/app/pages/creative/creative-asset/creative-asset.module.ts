import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { CreativeAssetComponent } from './creative-asset.component';
import { SharedModule } from '@pages/shared/shared.module';
import { SharedServiceModule } from '@pages/shared';


@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    CreativeAssetComponent,
  ],
  providers: [
    ...SharedServiceModule.forRoot().providers,
  ],
})
export class CreativeAssetPageModule { }
