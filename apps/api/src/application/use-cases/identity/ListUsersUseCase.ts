import { IUserRepository, ListUsersOptions } from '../../../domain/identity';
import { PaginatedResult } from '../../../domain/common';

export interface UserSummaryDto {
  id: string;
  name: string;
  email: string;
  role: string;
  healthId: string | null;
  createdAt: string;
}

export class ListUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(options: ListUsersOptions): Promise<PaginatedResult<UserSummaryDto>> {
    const result = await this.userRepository.findMany(options);
    
    return {
      items: result.items.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        healthId: user.healthId,
        createdAt: user.createdAt.toISOString()
      })),
      page: result.page,
      pageSize: result.pageSize,
      total: result.total
    };
  }
}
