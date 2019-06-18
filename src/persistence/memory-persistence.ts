import { IPersistence } from './persistence';
import * as _ from 'lodash';

export class MemoryPersistence implements IPersistence {
  public database = {};

  public initialize() {
    this.database = {};
  }

  public addItem(table: string, id: string, data: any) {
    this.ensureTableExists(table);
    this.database[table][id] = data;
    return Promise.resolve(data);
  }

  public setItem(table: string, id: string, data: any) {
    this.ensureTableExists(table);
    this.database[table][id] = data;
    return Promise.resolve(data);
  }

  public deleteItem(table: string, id: string) {
    this.ensureTableExists(table);
    this.database[table][id] = null;
    return Promise.resolve(null);
  }

  public getItem(table: string, id: string) {
    this.ensureTableExists(table);
    return Promise.resolve(this.database[table][id]);
  }

  public getItems(table: string, start: number, count: number) {
    this.ensureTableExists(table);
    return Promise.resolve(_.values(this.database[table]));
  }

  private ensureTableExists(table: string) {
    if (!this.database[table]) {
      this.database[table] = {};
    }
  }
}
