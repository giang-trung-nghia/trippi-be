import { Body, Controller, Post } from '@nestjs/common';
import { TokensService } from '@/modules/auth/tokens/tokens.service';
import { RefreshTokenDto } from '@/modules/auth/tokens/dtos/refresh-token.dto';

@Controller('api/v1/auth/tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Post('refresh')
  refresh(@Body() { refreshToken }: RefreshTokenDto) {
    return this.tokensService.rotateRefreshToken(refreshToken);
  }
}

