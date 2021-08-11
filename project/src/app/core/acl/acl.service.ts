
import { Injectable } from '@angular/core';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { DocumentModel } from '../api';
import { Observable, of as observableOf, forkJoin, zip } from 'rxjs';
import { DocumentPageService } from '../../pages/shared/services/document-page.service';
import { map, switchMap, filter, tap } from 'rxjs/operators';
import { UserModel } from '../api/nuxeo/lib/nuxeo.user-model';
import { UserRole, UserPermission } from './acl.interface';
import { UserService } from '../api/api.user.service';
import { CacheService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class ACLService {

  constructor(
    private userService: UserService,
    private cacheService: CacheService,
    private rolesService: NgxRolesService,
    private permissionsService: NgxPermissionsService,
    private documentPageService: DocumentPageService,
  ) {

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

  filterRouterTabs(tabs: any[], document?: DocumentModel): Observable<any[]> {
    tabs.forEach(x => { if (!x.acl) { x.acl = [UserPermission.View]; } if (!x.aclFn) { x.aclFn = (doc: DocumentModel, documentPageService: DocumentPageService): Observable<boolean> => observableOf(true); } });
    return this.permissionsService.permissions$.pipe(
      filter(_ => Object.keys(_).length !== 0),
      switchMap(_ => forkJoin([
        ...tabs.map((x: any) => zip(
          this.permissionsService.hasPermission(x.acl),
          this.cacheService.get(`ACL.RouterTab-${x.title}`, x.aclFn.call(this, document, this.documentPageService)),
        )),
      ]).pipe(
        map((r: any[]) => {
          const list = [];
          r.forEach((b: boolean[], i: number) => { if (b.every((x: boolean) => x)) { list.push(tabs[i]); } });
          return list;
        }),
      )),
    );
  }

  private performPermissions(): Observable<UserModel> {
    return this.userService.getCurrentUser().pipe(
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
