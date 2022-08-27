import { Types } from 'mongoose';

export interface CRUD {
  list: (limit: number, page: number) => Promise<any>;
  create: (resource: any) => Promise<any>;
  putById: (id: Types.ObjectId, resource: any) => Promise<any>;
  readById: (id: Types.ObjectId) => Promise<any>;
  deleteById: (id: Types.ObjectId) => Promise<any>;
  patchById: (id: Types.ObjectId, resource: any) => Promise<any>;
}
