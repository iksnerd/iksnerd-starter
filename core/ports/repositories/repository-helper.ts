import { OrderByOptions, PaginationOptions, QueryConstraint } from '@/core';

export type GetPayload = {
  id: string;
};

export type IDOnlyPayload = {
  id: string;
};

export type CreatePayload<T> = {
  data: T;
};

export type SetPayload<T> = {
  id: string;
  data: T;
};

export type UpdatePayload<T> = {
  id: string;
  data: Partial<T>;
};

export type GetOptions = {
  queryConstraints?: QueryConstraint[];
  pagination?: PaginationOptions;
  orderBy?: OrderByOptions;
};
