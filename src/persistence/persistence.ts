/**
 * This interface defines the database calls that are needed
 * to implement a portable profile server implementation.
 */
export interface IPersistence {
  initialize();
  addItem(table: string, id: string, data: any): Promise<any>;
  setItem(table: string, id: string, data: any): Promise<any>;
  deleteItem(table: string, id: string): Promise<null>;
  getItem(table: string, id: string): Promise<any>;
  getItems(table: string, start: number, count: number): Promise<any[]>;
}
