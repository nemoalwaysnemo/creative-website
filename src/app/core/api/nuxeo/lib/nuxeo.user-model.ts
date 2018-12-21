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

  get properties(): any {
    return this._properties;
  }

  get(propertyName: string): any {
    return this._dirtyProperties[propertyName] || this.properties[propertyName];
  }

}
