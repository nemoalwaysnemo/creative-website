
import { Injectable } from '@angular/core';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { UserService } from '../api/api.user.service';
import { UserModel } from '../api/nuxeo/lib/nuxeo.user-model';
import { UserRole, UserPermission } from './acl.interface';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap, filter, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ACLService {

  constructor(private userService: UserService, private permissionsService: NgxPermissionsService, private rolesService: NgxRolesService) {

  }

  perform(): Observable<UserModel> {
    // this.debug();
    this.performRoles();
    return this.performPermissions();
  }

  debug(): void {
    this.permissionsService.permissions$.subscribe((permissions) => {
      console.log(permissions);
    });
  }

  filterRouterTabs(tabs: any[]): Observable<any[]> {
    tabs.forEach(x => { if (!x.acl) { x.acl = [UserPermission.View]; } });
    return this.permissionsService.permissions$.pipe(
      filter(_ => Object.keys(_).length !== 0),
      switchMap(_ => forkJoin(tabs.map(x => this.permissionsService.hasPermission(x.acl))).pipe(
        map((r: boolean[]) => {
          const list = [];
          r.map((b, i) => { if (b) { list.push(tabs[i]); } });
          return list;
        }),
      )),
    );
  }

  private performPermissions(): Observable<UserModel> {
    return this.userService.getCurrentUserInfo().pipe(
      tap((user: UserModel) => {
        this.permissionsService.loadPermissions(user.getRole().permissions);
      }),
    );
  }

  private performRoles(): void {
    const roles = this.rolesService.getRoles();
    if (Object.keys(roles).length !== 0) {
      const p = {};
      p[UserRole.Developer.name] = UserRole.Developer.permissions;
      p[UserRole.Client.name] = UserRole.Client.permissions;
      p[UserRole.Admin.name] = UserRole.Admin.permissions;
      this.rolesService.addRoles(p);
    }
  }

}
