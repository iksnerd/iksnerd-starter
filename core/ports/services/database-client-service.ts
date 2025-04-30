import {
  DataCallback,
  ErrorCallback,
  OrderByOptions,
  PaginationOptions,
  QueryConstraint,
  UnsubscribeFn,
} from "@/core";

export interface DatabaseClientService {
  get<T>(collectionName: string, id: string): Promise<T | null>;

  getByField<T>(
    collectionName: string,
    queryConstraints: QueryConstraint[],
  ): Promise<T | null>;

  getPaginated<T>(
    collectionName: string,
    queryConstraints: QueryConstraint[],
    paginationOptions: PaginationOptions,
    orderByOptions?: OrderByOptions,
  ): Promise<T[]>;

  getPaginatedGroup<T>(
    collectionName: string,
    queryConstraints: QueryConstraint[],
    paginationOptions: PaginationOptions,
    orderByOptions?: OrderByOptions,
  ): Promise<T[]>;

  getAll<T>(
    collectionName: string,
    queryConstraints?: QueryConstraint[],
    orderByOptions?: OrderByOptions,
  ): Promise<T[]>;

  getAllGroup<T>(
    collectionName: string,
    queryConstraints?: QueryConstraint[],
    orderByOptions?: OrderByOptions,
  ): Promise<T[]>;

  getSubscription<T>(
    collectionName: string,
    onDataCallback: DataCallback<T>,
    onErrorCallback: ErrorCallback,
    queryConstraints: QueryConstraint[],
    orderByOptions?: OrderByOptions,
  ): UnsubscribeFn;

  create<T>(collectionName: string, data: T): Promise<string>;

  set<T>(collectionName: string, id: string, data: T): Promise<void>;

  update<T>(
    collectionName: string,
    id: string,
    data: Partial<T>,
  ): Promise<void>;

  updateArrayUnion(
    collectionName: string,
    id: string,
    field: string,
    values: unknown[],
  ): Promise<void>;

  updateArrayRemove(
    collectionName: string,
    id: string,
    field: string,
    values: unknown[],
  ): Promise<void>;

  updateIncrement(
    collectionName: string,
    id: string,
    field: string,
    value: number,
  ): Promise<void>;

  count: (
    collectionName: string,
    queryConstraints: QueryConstraint[],
  ) => Promise<number | null>;

  sum: (
    collectionName: string,
    field: string,
    queryConstraints: QueryConstraint[],
  ) => Promise<number | null>;

  delete(collectionName: string, id: string): Promise<void>;
}
