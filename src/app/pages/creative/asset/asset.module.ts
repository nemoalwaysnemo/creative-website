import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { AssetComponent } from './asset.component';
import { SharedModule } from '@pages/shared/shared.module';


@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    AssetComponent,
  ],
  providers: [
    // SharedModule.forRoot().providers,
  ],
})
export class AssetPageModule { }
