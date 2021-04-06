import Dexie from 'dexie';

export class TriggerModel {
  [key: string]: any;

  constructor(data: any = {}) {
  }
}

export class BackslashTriggerDatabase extends Dexie {

  triggers: Dexie.Table<TriggerModel, number>;  // table definition

  constructor() {
    super('Backslash-Trigger-Database');

    this.version(1).stores({
      triggers: '++id',
    });

    this.triggers = this.table('triggers');
  }
}
