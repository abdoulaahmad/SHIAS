import { User } from './User';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByHealthId(healthId: string): Promise<User | null>;
  searchPatients(query: string): Promise<User[]>;
  save(user: User): Promise<void>;
  update(user: User): Promise<void>;
}
