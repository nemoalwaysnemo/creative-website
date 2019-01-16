import { deepExtend } from '../../../services';
import { ServerVersion } from './nuxeo.server-version';
import { Base } from './base.api';

/**
 * The `DirectoryEntry` class wraps a directory entry.
 *
 * **Cannot directly be instantiated**
 */
export class DirectoryEntry extends Base {

  private id: string;
  private _directory: any = {};
  private properties: any = {};
  private _dirtyProperties: any = {};

  /**
   * Creates a DirectoryEntry.
   * @param {object} entry - The initial entry object.
   *                         This DirectoryEntry object will be extended with entry properties.
   * @param {object} opts - The configuration options.
   * @param {string} opts.directory - The {@link Directory} object linked to this entry.
   */
  constructor(entry: any = {}, opts: any = {}) {
    super(opts);
    this._directory = opts.directory;
    this.properties = {};
    this._dirtyProperties = {};
    const { serverVersion } = this._directory._nuxeo;
    // compatibility code for 8.10 (or unknown version) - make all properties dirty so that
    // the `idField` will be passed when updating
    if (!serverVersion || serverVersion.lt(ServerVersion.LTS_2017)) {
      this._dirtyProperties = deepExtend({}, entry.properties);
    }
    deepExtend(true, this, entry);
  }

  /**
   * Sets entry properties.
   * @param {object} properties - The properties to set.
   * @returns {DirectoryEntry}
   *
   * @example
   * entry.set({
   *   'label': 'new label',
   *   'ordering': 50,
   * });
   */
  set(properties: any = {}): this {
    this._dirtyProperties = deepExtend(true, {}, this._dirtyProperties, properties);
    return this;
  }

  /**
   * Gets an entry property.
   * @param {string} propertyName - The property name, such as 'label', 'ordering', ...
   * @returns {DirectoryEntry}
   */
  get(propertyName: string): any {
    return this._dirtyProperties[propertyName] || this.properties[propertyName];
  }

  /**
   * Saves the entry. It updates only the 'dirty properties' set through the {@link DirectoryEntry#set} method.
   * @param {object} [opts] - Options overriding the ones from this object.
   * @returns {Promise} A promise object resolved with the updated entry.
   */
  save(opts: any = {}) {
    const options = this._computeOptions(opts);
    return this._directory.update({
      id: this.id,
      properties: this._dirtyProperties,
    }, options);
  }
}
