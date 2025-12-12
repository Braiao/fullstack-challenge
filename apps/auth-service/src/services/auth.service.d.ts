import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { RegisterDto, LoginDto, AuthTokens, JwtPayload } from '@repo/types';
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<AuthTokens>;
    login(loginDto: LoginDto): Promise<AuthTokens>;
    refresh(refreshToken: string): Promise<AuthTokens>;
    validateUser(payload: JwtPayload): Promise<User>;
    private generateTokens;
}
//# sourceMappingURL=auth.service.d.ts.map