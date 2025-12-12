import { AuthService } from '../services/auth.service';
import { RegisterDto, LoginDto } from '@repo/types';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<import("@repo/types").AuthTokens>;
    login(loginDto: LoginDto): Promise<import("@repo/types").AuthTokens>;
    refresh(data: {
        refreshToken: string;
    }): Promise<import("@repo/types").AuthTokens>;
    validate(payload: any): Promise<import("../entities/user.entity").User>;
}
//# sourceMappingURL=auth.controller.d.ts.map