import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { DetailComponent } from './detail.component';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    DetailComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
  ],
})
export class DetailPageModule { }
