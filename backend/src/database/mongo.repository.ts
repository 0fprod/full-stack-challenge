export interface MongoRepository<T> {
  findOne(id: string): Promise<T>;
  findAll(skip?: number, limit?: number): Promise<T[]>;
  create(entity: T): Promise<T>;
  update(entity: Partial<T>): Promise<T>;
  remove(id: string): Promise<T>;
}
