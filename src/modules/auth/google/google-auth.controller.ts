import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from '@/common/guards/google-auth.guard';
import { GoogleAuthService } from '@/modules/auth/google/google-auth.service';
import { GoogleProfilePayload } from '@/modules/auth/google/interfaces/google-profile.interface';

@Controller('api/v1/auth/google')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Get('sign-in')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // Guard handles the redirect to Google
  }

  @Get('callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(
    @Res() res,
    @Req() req: { user: GoogleProfilePayload },
  ) {
    const redirectUrl = await this.googleAuthService.handleGoogleLogin(
      req.user,
    );

    return res.redirect(redirectUrl);
  }
}
