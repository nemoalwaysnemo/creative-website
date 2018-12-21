import { Base } from './base.api';

export class UserModel extends Base {
  private _properties: any;
  private _dirtyProperties: any;

  constructor(user: any, opts: any = {}) {
    super(opts);
    this._properties = {};
    this._dirtyProperties = {};
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
    return this._dirtyProperties[propertyName] || this.properties[propertyName];
  }

}
