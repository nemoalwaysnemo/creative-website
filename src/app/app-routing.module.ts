import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/base-auth';

const routes: Routes = [
  {
    path: 'p',
    canActivate: [AuthGuard],
    loadChildren: () => import('app/pages/pages.module').then(m => m.PagesModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('app/auth/auth.module').then(m => m.AuthModule),
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
