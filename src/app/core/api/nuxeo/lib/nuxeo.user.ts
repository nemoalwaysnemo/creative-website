import { Base } from './base.api';

export class User extends Base {
  private _users: any;
  private _properties: any;
  private _dirtyProperties: any;
  private _queryParams: any;

  constructor(user: any, opts: any = {}) {
    super(opts);
    this._users = opts.users;
    this._properties = {};
    this._dirtyProperties = {};
    Object.assign(this, user);
  }

  // set(properties: {}) {
  //   this._dirtyProperties = Object.assign(this._dirtyProperties, properties);
  //   return this;
  // }
  get properties(): any {
    return this._properties;
  }

  set properties(properties: any) {
    this._properties = properties;
  }

  get(propertyName: string): any {
    return this._dirtyProperties[propertyName] || this.properties[propertyName];
  }

  // save(opts: {} = {}) {
  //   const options = this._computeOptions(opts);
  //   return this._users.update({
  //     id: this.id,
  //     properties: this._dirtyProperties,
  //   }, options);
  // }

}
