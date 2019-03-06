import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';
@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    RouterModule,
  ],
  declarations: [
    HomeComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
  ],
})
export class HomePageModule { }
