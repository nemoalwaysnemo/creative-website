import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@pages/shared/shared.module';
import { IntelligenceFoldersComponent } from './intelligence-folders.component';
@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    RouterModule,
  ],
  declarations: [
    IntelligenceFoldersComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
  ],
})
export class IntelligenceFoldersModule { }
