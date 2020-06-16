import { NuxeoUserGroups, UserRole } from '../../../acl/acl.interface';

export class UserModel {
  private _properties: any = {};

  constructor(user: any, opts: any = {}) {
    Object.assign(this, user, { avatar: opts.assetPath + 'assets/images/user_icon.png' });
  }

  get username(): string {
    return this.get('username');
  }

  get companycode(): string {
    return this.get('companycode');
  }

  get properties(): any {
    return this._properties;
  }

  set properties(properties: any) {
    this._properties = properties;
  }

  get(propertyName: string): any {
    return this.properties[`user:${propertyName}`];
  }

  hasGroup(groupName: string): boolean {
    return (this.get('groups') || []).includes(groupName);
  }

  isAdmin(): boolean {
    return this.hasGroup(NuxeoUserGroups.Admin);
  }

  canAccess(): boolean {
    return this.hasGroup(NuxeoUserGroups.Everyone);
  }

  getRole(): any {
    const groups = this.get('groups');
    if (this.isAdmin() && (groups.includes('-CN-Dalian-') || groups.includes('-IN-Noida-') || groups.includes('-US-New York-'))) {
      return UserRole.Developer;
    } else if (this.isAdmin()) {
      return UserRole.Admin;
    } else if (this.canAccess()) {
      return UserRole.Client;
    }
  }

}
