import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@pages/shared/shared.module';
import { IntelligenceAssetsComponent } from './intelligence-assets.component';
@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    RouterModule,
  ],
  declarations: [
    IntelligenceAssetsComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
  ],
})
export class IntelligenceAssetsModule { }
