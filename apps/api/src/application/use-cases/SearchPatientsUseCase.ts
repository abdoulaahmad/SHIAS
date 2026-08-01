import { IUserRepository, User } from '../../domain/identity';

export class SearchPatientsUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(query: string): Promise<User[]> {
    if (!query || query.length < 2) {
      return [];
    }
    return this.userRepository.searchPatients(query);
  }
}
