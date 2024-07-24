export interface IPagination<T> {
  page: number;
  limit: number;
  total: number;
  items: T;
}
