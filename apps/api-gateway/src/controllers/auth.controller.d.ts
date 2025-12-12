import { ClientProxy } from '@nestjs/microservices';
import { RegisterDto, LoginDto, RefreshTokenDto } from '../dto/auth.dto';
export declare class AuthController {
    private authClient;
    constructor(authClient: ClientProxy);
    register(registerDto: RegisterDto): Promise<any>;
    login(loginDto: LoginDto): Promise<any>;
    refresh(refreshTokenDto: RefreshTokenDto): Promise<any>;
}
//# sourceMappingURL=auth.controller.d.ts.map