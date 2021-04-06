import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { BackslashTriggerDatabase } from './backslash-trigger.database';

@Injectable({
  providedIn: 'root',
})
export class IndexedDBService {

  db: any = new BackslashTriggerDatabase();

  constructor() {

  }

  add(table: string, object: any | any[]): Observable<any> {
    if (Array.isArray(object)) {
      return from(this.db.table(table).bulkAdd(object));
    } else {
      return from(this.db.table(table).add(object));
    }
  }

  count(table: string): Observable<any> {
    return from(this.db.table(table).count());
  }

  addOrUpdateOne(table: string, object: any, key?: any): Observable<any> {
    if (key) {
      return from(this.db.table(table).put(object, key));
    } else {
      return from(this.db.table(table).put(object));
    }
  }

  addOrUpdateMultiple(table: string, objects: any[], keys?: any): Observable<any> {
    if (keys) {
      return from(this.db.table(table).bulkPut(objects, keys));
    } else {
      return from(this.db.table(table).bulkPut(objects));
    }
  }

  delete(table: string, primaryKey: any | any[]): Observable<any> {
    if (Array.isArray(primaryKey)) {
      return from(this.db.table(table).bulkDelete(primaryKey));
    } else {
      return from(this.db.table(table).delete(primaryKey));
    }
  }

  clearAll(table: string): Observable<any> {
    return from(this.db.table(table).clear());
  }

  where(table: string, where: any): Observable<any> {
    return from(this.db.table(table).where(where).toArray());
  }

  operateOnEach(table: string, callback: (item: any, idbCursor: any) => any): Observable<any> {
    return from(this.db.table(table).each(callback));
  }

  filter(table: string, filterFunction: (value: any) => boolean): any {
    return this.db.table(table).filter(filterFunction);
  }

  getByPrimaryKey(table: string, primaryKey: any, callback?: (item: any) => any): Observable<any> {
    if (callback) {
      return from(this.db.table(table).get(primaryKey, callback));
    } else {
      return from(this.db.table(table).get(primaryKey));
    }
  }

  getByKeyToValueMap(table: string, keyValueMap: any, callback?: (item: any) => any): Observable<any> {
    if (callback) {
      return from(this.db.table(table).get(keyValueMap, callback));
    } else {
      return from(this.db.table(table).get(keyValueMap));
    }
  }

  getFirstNItemsOfTable(table: string, num: number): Observable<any> {
    return from(this.db.table(table).limit(num));
  }

  orderBy(table: string, index: string): Observable<any> {
    return from(this.db.table(table).orderBy(index));
  }

  offset(table: string, ignoreUpto: number): Observable<any> {
    return from(this.db.table(table).offset(ignoreUpto));
  }

  reverse(table: string): Observable<any> {
    return from(this.db.table(table).reverse());
  }

  toArray(table: string, callback?: (objects: any[]) => any): Observable<any> {
    if (callback) {
      return from(this.db.table(table).toArray(callback));
    } else {
      return from(this.db.table(table).toArray());
    }
  }

  toCollection(table: string): Observable<any> {
    return from(this.db.table(table).toCollection());
  }

  update(table: string, key: any, changes: any): Observable<any> {
    return from(this.db.table(table).update(key, changes));
  }

}
