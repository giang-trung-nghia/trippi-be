import { Injectable, Logger } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { AuthProvidersService } from '@/modules/auth-providers/auth-providers.service';
import { UsersService } from '@/modules/users/users.service';
import { GoogleProfilePayload } from '@/modules/auth/google/interfaces/google-profile.interface';
import { AuthProviderEnum } from '@/common/enums/auth-provider.enum';
import { UserRole } from '@/common/enums/user-role.enum';
import { User } from '@/modules/users/entities/user.entity';
import { TokensService } from '@/modules/auth/tokens/tokens.service';

@Injectable()
export class GoogleAuthService {
  private readonly logger = new Logger(GoogleAuthService.name);

  constructor(
    private readonly authProvidersService: AuthProvidersService,
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
  ) {}

  async handleGoogleLogin(profile: GoogleProfilePayload) {
    const existingProvider =
      await this.authProvidersService.findByProviderAccount(
        AuthProviderEnum.GOOGLE,
        profile.providerUserId,
      );

    if (existingProvider?.user) {
      const tokens = await this.tokensService.generateTokens(
        existingProvider.user,
      );
      return { user: existingProvider.user, tokens };
    }

    const user = await this.findOrCreateUser(profile);

    await this.authProvidersService.create({
      provider: AuthProviderEnum.GOOGLE,
      providerUserId: profile.providerUserId,
      email: profile.email,
      userId: user.id,
    });

    const tokens = await this.tokensService.generateTokens(user);

    return { user, tokens };
  }

  private async findOrCreateUser(
    profile: GoogleProfilePayload,
  ): Promise<User> {
    const existingUser = await this.findUserByEmail(profile.email);
    if (existingUser) {
      return existingUser;
    }

    const generatedPassword = randomBytes(16).toString('hex');

    const user = await this.usersService.create({
      email: profile.email,
      name: profile.displayName ?? profile.email,
      password: generatedPassword,
      confirmPassword: generatedPassword,
      role: UserRole.USER,
    });

    this.logger.debug(`Created new user ${user.id} from Google profile.`);
    return user;
  }

  private async findUserByEmail(email: string): Promise<User | null> {
    try {
      return await this.usersService.getUserByEmail(email);
    } catch {
      return null;
    }
  }
}

