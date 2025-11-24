import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Req,
  Res,
  Body,
} from '@nestjs/common';
import type { Request as ExpressRequest, Response } from 'express';
import { AuthService } from '@/modules/auth/auth.service';
import { AuthSessionResponseDto } from '@/modules/auth/dtos/auth-session-response.dto';
import { LogoutResponseDto } from '@/modules/auth/dtos/logout-response.dto';

type RefreshRequest = Omit<ExpressRequest, 'cookies'> & {
  cookies?: Record<string, string | undefined>;
};

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('refresh')
  /**
   * Refreshes the session while supporting both:
   * - Browser flows (refresh token comes from the HTTP-only cookie)
   * - Non-browser clients (mobile, tests) that pass the token in the payload
   */
  async refresh(
    @Req() req: RefreshRequest,
    @Res({ passthrough: true }) res: Response,
    @Body('refreshToken') refreshToken?: string,
  ): Promise<AuthSessionResponseDto> {
    const cookieToken = this.getRefreshTokenFromRequest(req);
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
    const cookieToken = this.getRefreshTokenFromRequest(req);
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
    const refreshToken = this.getRefreshTokenFromRequest(req);
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is missing.');
    }

    await this.authService.revokeRefreshToken(refreshToken);
    this.authService.clearRefreshTokenCookie(res);
    return { message: 'Logged out successfully.' };
  }

  private getRefreshTokenFromRequest(req: RefreshRequest): string | undefined {
    const cookiesUnknown = req.cookies;
    if (
      !cookiesUnknown ||
      typeof cookiesUnknown !== 'object' ||
      Array.isArray(cookiesUnknown)
    ) {
      return undefined;
    }
    const refreshToken = (cookiesUnknown as Record<string, unknown>)
      .refreshToken;
    return typeof refreshToken === 'string' ? refreshToken : undefined;
  }
}
