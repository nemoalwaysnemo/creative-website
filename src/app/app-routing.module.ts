import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/base-auth';

const routes: Routes = [
  {
    path: 'p',
    canActivate: [AuthGuard],
    loadChildren: 'app/pages/pages.module#PagesModule',
  },
  {
    path: 'auth',
    loadChildren: 'app/auth/auth.module#AuthModule',
  },
  { path: '', redirectTo: 'p', pathMatch: 'full' },
  { path: '**', redirectTo: 'p/error/404' },
];

const config: ExtraOptions = {
  useHash: true,
  anchorScrolling: 'enabled',
  onSameUrlNavigation: 'reload',
  scrollPositionRestoration: 'enabled',
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
