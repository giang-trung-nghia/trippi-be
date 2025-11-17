import { Injectable, Logger } from '@nestjs/common';
import { AuthProvidersService } from '@/modules/auth-providers/auth-providers.service';
import { UsersService } from '@/modules/users/users.service';
import { GoogleProfilePayload } from '@/modules/auth/google/interfaces/google-profile.interface';
import { AuthProviderEnum } from '@/common/enums/auth-provider.enum';
import { User } from '@/modules/users/entities/user.entity';
import { TokensService } from '@/modules/auth/tokens/tokens.service';
import { CreateUserOauthDto } from '@/modules/users/dtos/create-user-oauth.dto';
import { UserRole } from '@/common/enums/user-role.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleAuthService {
  private readonly logger = new Logger(GoogleAuthService.name);

  constructor(
    private readonly authProvidersService: AuthProvidersService,
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
    private readonly configService: ConfigService,
  ) {}

  async handleGoogleLogin(profile: GoogleProfilePayload): Promise<string> {
    const existingProvider =
      await this.authProvidersService.findByProviderAccount(
        AuthProviderEnum.GOOGLE,
        profile.providerUserId,
      );

    if (existingProvider?.user) {
      const tokens = await this.tokensService.generateTokens(
        existingProvider.user,
      );
      return (
        this.configService.get<string>('FRONTEND_URL') +
        '/auth/google/callback?token=' +
        tokens.accessToken
      );
    }

    const user = await this.findOrCreateUser(profile);

    await this.authProvidersService.create({
      provider: AuthProviderEnum.GOOGLE,
      providerUserId: profile.providerUserId,
      email: profile.email,
      photoUrl: profile.photo,
      userId: user.id,
    });

    const tokens = await this.tokensService.generateTokens(user);
    const redirectUrl =
      this.configService.get<string>('FRONTEND_URL') +
      '/auth/google/callback?token=' +
      tokens.accessToken;
    return redirectUrl;
  }

  private async findOrCreateUser(profile: GoogleProfilePayload): Promise<User> {
    const existingUser = await this.findUserByEmail(profile.email);
    if (existingUser) {
      return existingUser;
    }

    const oauthUser: CreateUserOauthDto = {
      email: profile.email,
      name: profile.displayName ?? profile.email,
      photoUrl: profile.photo,
      role: UserRole.USER,
    };

    const user = await this.usersService.createOauthUser(oauthUser);

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
