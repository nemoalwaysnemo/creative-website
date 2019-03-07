
export class UserModel {
  private _properties: any = {};

  constructor(user: any, opts: any = {}) {
    Object.assign(this, user);
  }

  get username(): string {
    return this.get('username');
  }

  get properties(): any {
    return this._properties;
  }

  set properties(properties: any) {
    this._properties = properties;
  }

  get(propertyName: string): any {
    return this.properties[propertyName];
  }

}
