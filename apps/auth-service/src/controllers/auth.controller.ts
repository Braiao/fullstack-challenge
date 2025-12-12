import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from '../services/auth.service';
import { RegisterDto, LoginDto } from '@repo/types';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.register')
  async register(@Payload() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @MessagePattern('auth.login')
  async login(@Payload() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @MessagePattern('auth.refresh')
  async refresh(@Payload() data: { refreshToken: string }) {
    return this.authService.refresh(data.refreshToken);
  }

  @MessagePattern('auth.validate')
  async validate(@Payload() payload: any) {
    return this.authService.validateUser(payload);
  }
}
