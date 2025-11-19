import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from '@/common/guards/google-auth.guard';
import { GoogleAuthService } from '@/modules/auth/google/google-auth.service';
import { GoogleProfilePayload } from '@/modules/auth/google/interfaces/google-profile.interface';
import { AuthService } from '@/modules/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';

@Controller('api/v1/auth/google')
export class GoogleAuthController {
  constructor(
    private readonly googleAuthService: GoogleAuthService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('sign-in')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // Guard handles the redirect to Google
  }

  @Get('callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(
    @Res() res: Response,
    @Req() req: { user: GoogleProfilePayload },
  ) {
    const { tokens } = await this.googleAuthService.handleGoogleLogin(req.user);
    this.authService.setRefreshTokenCookie(res, tokens.refreshToken);
    const redirectUrl = this.configService.get<string>('FRONTEND_URL') ?? '/';
    return res.redirect(redirectUrl);
  }
}
