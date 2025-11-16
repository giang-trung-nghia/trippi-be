import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GoogleAuthService } from '@/modules/auth/google/google-auth.service';
import { GoogleProfilePayload } from '@/modules/auth/google/interfaces/google-profile.interface';

@Controller('api/v1/auth/google')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuth(): Promise<void> {
    // Guard handles the redirect to Google
  }

  @Get('callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: { user: GoogleProfilePayload }) {
    const { user, tokens } = await this.googleAuthService.handleGoogleLogin(
      req.user,
    );
    return {
      message: 'Google authentication successful',
      user,
      tokens,
    };
  }
}

