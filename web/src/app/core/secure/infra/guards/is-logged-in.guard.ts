import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

import { JwtService } from "../services";

/**
 * Guard responsável por verificar se o usuário está logado, ou seja, se o token JWT
 * é válido e não expirou.
 * @returns CanActivateFn
 */
export const isLoggedInGuard: CanActivateFn = () => {
    const jwt = inject(JwtService);
    const router = inject(Router);

    return jwt.isExpired() ? router.createUrlTree(["/auth/sign-in"]) : true;
};
