export enum QueryConstraintOperators {
  LOWER = '<',
  LOWER_OR_EQUAL = '<=',
  EQUAL = '==',
  IS_NOT = '!=',
  GREATER_THAN_OR_EQUAL = '>=',
  GREATER = '>',
  ARRAY_CONTAINS = 'array-contains',
  IN = 'in',
  ARRAY_CONTAINS_ANY = 'array-contains-any',
  NOT_IN = 'not-in',
}

export interface QueryConstraint {
  field: string;
  operator:
    | '<'
    | '<='
    | '=='
    | '!='
    | '>='
    | '>'
    | 'array-contains'
    | 'in'
    | 'array-contains-any'
    | 'not-in';
  value: unknown;
}

export interface PaginationOptions {
  limit?: number;
  cursor?: string;
}

export interface OrderByOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FieldNameAndValue {
  name: string;
  value: number;
}

export type UnsubscribeFn = () => void;

export interface DataCallback<T> {
  (data: T[]): void;
}

export interface ErrorCallback {
  (error: Error): void;
}
