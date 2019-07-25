import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login.component';

const routes: Routes = [{
  path: '',
  component: AuthComponent,
  children: [
    {
      path: '',
      component: LoginComponent,
    },
    {
      path: 'login',
      component: LoginComponent,
      pathMatch: 'full',
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {
}
