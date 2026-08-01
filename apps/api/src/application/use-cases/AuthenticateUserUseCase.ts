import { IUserRepository, IPasswordHasher, ITokenService, AuthTokens, InvalidCredentialsError } from '../../domain/identity';

export interface AuthenticateUserRequest {
  email: string;
  password: string;
}

export interface AuthenticateUserResponse {
  tokens: AuthTokens;
  user: {
    id: string;
    role: string;
    name: string;
  };
}

export class AuthenticateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService
  ) {}

  async execute(req: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
    const user = await this.userRepository.findByEmail(req.email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isValidPassword = await this.passwordHasher.verify(req.password, user.passwordHash);
    if (!isValidPassword) {
      throw new InvalidCredentialsError();
    }

    const tokens = this.tokenService.generateTokens(user);

    return {
      tokens,
      user: {
        id: user.id,
        role: user.role,
        name: user.name
      }
    };
  }
}
