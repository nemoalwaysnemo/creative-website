import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';
import { HomeSearchFormModule } from '@pages/shared';

@NgModule({
  imports: [
    ThemeModule,
    HomeSearchFormModule,
    RouterModule,
  ],
  declarations: [
    HomeComponent,
  ],
})
export class HomePageModule { }
