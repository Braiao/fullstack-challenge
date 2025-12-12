import { Strategy } from 'passport-jwt';
import { AuthService } from '../services/auth.service';
import { JwtPayload } from '@repo/types';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(payload: JwtPayload): Promise<import("../entities/user.entity").User>;
}
export {};
//# sourceMappingURL=jwt.strategy.d.ts.map