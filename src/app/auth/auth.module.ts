import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { AuthRoutingModule } from './auth.routes';
import { LoginComponent } from './login.component';
import { AuthComponent } from './auth.component';

@NgModule({
  imports: [
    ThemeModule,
    AuthRoutingModule,
  ],
  declarations: [
    AuthComponent,
    LoginComponent,
  ],
})
export class AuthModule {
}
