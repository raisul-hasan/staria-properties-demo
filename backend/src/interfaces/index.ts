export interface IBaseRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(query?: Record<string, unknown>): Promise<T[]>;
  create(data: Record<string, unknown>): Promise<T>;
  update(id: string, data: Record<string, unknown>): Promise<T>;
  delete(id: string): Promise<T>;
}
