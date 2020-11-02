/**
 * The `DirectoryEntry` class wraps a directory entry.
 *
 * **Cannot directly be instantiated**
 */
export class DirectoryEntry {

  readonly id: string;
  readonly label: string;
  readonly obsolete: number;
  readonly ordering: number;

  constructor(entry: any = {}, opts: any = {}) {
    Object.assign(this, { id: entry.properties.id, label: entry.properties.label, obsolete: entry.properties.obsolete, ordering: entry.properties.ordering });
  }

}
