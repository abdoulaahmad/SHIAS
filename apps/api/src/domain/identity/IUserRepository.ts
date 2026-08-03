import { User } from './User';
import { Role } from './Role';
import { PaginationOptions, PaginatedResult } from '../common';

export interface ListUsersOptions extends PaginationOptions {
  role?: Role;
}

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByHealthId(healthId: string): Promise<User | null>;
  searchPatients(query: string): Promise<User[]>;
  findMany(options: ListUsersOptions): Promise<PaginatedResult<User>>;
  save(user: User): Promise<void>;
  update(user: User): Promise<void>;
}
