import { IUserRepository, ITokenService, AuthTokens, InvalidTokenError } from '../../domain/identity';

export interface RefreshSessionRequest {
  refreshToken: string;
}

export class RefreshSessionUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService
  ) {}

  async execute(req: RefreshSessionRequest): Promise<AuthTokens> {
    const decoded = this.tokenService.verifyRefreshToken(req.refreshToken);
    if (!decoded || !decoded.sub) {
      throw new InvalidTokenError();
    }

    const user = await this.userRepository.findById(decoded.sub);
    if (!user) {
      throw new InvalidTokenError();
    }

    return this.tokenService.generateTokens(user);
  }
}
