import { IUserRepository, UserNotFoundError } from '../../../domain/identity';
import { UserSummaryDto } from './ListUsersUseCase';

export class GetUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<UserSummaryDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      healthId: user.healthId,
      createdAt: user.createdAt.toISOString()
    };
  }
}
