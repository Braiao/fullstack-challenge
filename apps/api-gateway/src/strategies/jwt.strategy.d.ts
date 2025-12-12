import { Strategy } from 'passport-jwt';
import { JwtPayload } from '@repo/types';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate(payload: JwtPayload): Promise<{
        id: string;
        email: string;
        username: string;
    }>;
}
export {};
//# sourceMappingURL=jwt.strategy.d.ts.map