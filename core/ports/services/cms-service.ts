// export interface HygraphQueryClientService {
//   <T>(query: string): Promise<T | null>;
// }

export interface CmsService {
  query<T>(query: string): Promise<T | null>;
}
