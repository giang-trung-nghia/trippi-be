import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import type { Request as ExpressRequest, Response } from 'express';
import { AuthService } from '@/modules/auth/auth.service';
import { AuthSessionResponseDto } from '@/modules/auth/dtos/auth-session-response.dto';
import { LogoutResponseDto } from '@/modules/auth/dtos/logout-response.dto';
import { RefreshTokenDto } from '@/modules/auth/dtos/refresh-token.dto';

type RefreshRequest = ExpressRequest & {
  cookies?: Record<string, string | undefined>;
};

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('refresh')
  /**
   * Refreshes the session by:
   * 1. Reading the refresh token from either the HTTP-only cookie or the request body (fallback for non-browser clients).
   * 2. Validating & rotating the token via AuthService.
   * 3. Setting the new refresh token cookie and returning a fresh access token plus user info.
   */
  async refresh(
    @Req() req: RefreshRequest,
    @Res({ passthrough: true }) res: Response,
    { refreshToken }: RefreshTokenDto,
  ): Promise<AuthSessionResponseDto> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const cookieToken = (req.cookies ?? {}).refreshToken;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const incomingToken = refreshToken ?? cookieToken;
    if (!incomingToken) {
      throw new BadRequestException('Refresh token is required.');
    }

    const session = await this.authService.renewSession(incomingToken);
    this.authService.setRefreshTokenCookie(res, session.tokens.refreshToken);
    return {
      accessToken: session.tokens.accessToken,
      user: session.user,
    };
  }

  @Get('me')
  async me(
    @Req() req: RefreshRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthSessionResponseDto> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const cookieToken = (req.cookies ?? {}).refreshToken;
    if (!cookieToken) {
      throw new BadRequestException('Refresh token is missing.');
    }

    const session = await this.authService.renewSession(cookieToken);
    this.authService.setRefreshTokenCookie(res, session.tokens.refreshToken);
    return {
      accessToken: session.tokens.accessToken,
      user: session.user,
    };
  }

  @Post('logout')
  async logout(
    @Req() req: RefreshRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LogoutResponseDto> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const refreshToken = (req.cookies ?? {}).refreshToken;
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is missing.');
    }

    await this.authService.revokeRefreshToken(refreshToken);
    this.authService.clearRefreshTokenCookie(res);
    return { message: 'Logged out successfully.' };
  }
}
