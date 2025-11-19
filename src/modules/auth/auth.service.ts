import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/modules/users/users.service';
import { User } from '@/modules/users/entities/user.entity';
import { Response, CookieOptions } from 'express';

import { TokensResponse } from '@/modules/auth/interfaces/tokens-response.interface';
import { TokenPayload } from '@/modules/auth/interfaces/token-payload.interface';
import { SessionWithTokens } from '@/modules/auth/interfaces/session.interface';
import { AuthUserResponseDto } from '@/modules/auth/dtos/auth-user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async generateTokens(user: User): Promise<TokensResponse> {
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const accessSecret = this.configService.get<string>('JWT_ACCESS_SECRET');
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
    const accessExpiresIn = (this.configService.get<string>(
      'JWT_ACCESS_EXPIRES_IN',
    ) ?? '10m') as JwtSignOptions['expiresIn'];
    const refreshExpiresIn = (this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
    ) ?? '1d') as JwtSignOptions['expiresIn'];

    if (!accessSecret || !refreshSecret) {
      throw new UnauthorizedException('JWT secrets are not configured');
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn: accessExpiresIn,
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: refreshExpiresIn,
      }),
    ]);

    await this.usersService.setRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async renewSession(refreshToken: string): Promise<SessionWithTokens> {
    const payload = await this.verifyRefreshToken(refreshToken);
    const user = await this.usersService.validateRefreshToken(
      payload.sub,
      refreshToken,
    );
    const tokens = await this.generateTokens(user);
    return { user: this.toAuthUserResponse(user), tokens };
  }

  setRefreshTokenCookie(res: Response, refreshToken: string): void {
    res.cookie('refreshToken', refreshToken, this.getRefreshCookieOptions());
  }

  clearRefreshTokenCookie(res: Response): void {
    res.cookie('refreshToken', '', {
      ...this.getRefreshCookieOptions(),
      maxAge: 0,
    });
  }

  async revokeRefreshToken(refreshToken: string): Promise<void> {
    const payload = await this.verifyRefreshToken(refreshToken);
    await this.usersService.clearRefreshToken(payload.sub);
  }

  private async verifyRefreshToken(
    refreshToken: string,
  ): Promise<TokenPayload> {
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
    if (!refreshSecret) {
      throw new UnauthorizedException('Refresh token secret not configured');
    }

    try {
      return await this.jwtService.verifyAsync<TokenPayload>(refreshToken, {
        secret: refreshSecret,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private getRefreshCookieOptions(): CookieOptions {
    const maxAge = this.parseExpiresInToMs(
      this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d',
    );
    return {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge,
      path: '/',
    };
  }

  private parseExpiresInToMs(value: string): number {
    const trimmed = value.trim();
    const match = /^(\d+)([smhd])$/.exec(trimmed);
    if (match) {
      const num = Number(match[1]);
      const unit = match[2];
      const unitMap: Record<string, number> = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000,
      };
      return num * unitMap[unit];
    }
    const fallback = Number(trimmed);
    if (!Number.isNaN(fallback) && fallback > 0) {
      return fallback;
    }
    return 7 * 24 * 60 * 60 * 1000;
  }

  private toAuthUserResponse(user: User): AuthUserResponseDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      photoUrl: user.photoUrl,
    };
  }
}
