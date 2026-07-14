import { inject, provideAppInitializer } from "@angular/core";

import { AuthService, ConnectionService, JwtService } from "../services";

const SESSION_EXP_KEY = "_session_exp";

export function provideAuthInitializer() {
    return provideAppInitializer(async () => {
        const jwt = inject(JwtService);
        const auth = inject(AuthService);
        const connection = inject(ConnectionService);

        let data;
        try {
            data = await auth.getSession();
        } catch {
            connection.notifyOffline();
            return;
        }

        if (!data?.session) return;

        const stored = sessionStorage.getItem(SESSION_EXP_KEY);
        const expiresAt = stored ?? String(data.session.expiresAt);

        if (!stored) {
            sessionStorage.setItem(SESSION_EXP_KEY, expiresAt);
        }

        jwt.setExpiresAt(expiresAt);

        if (jwt.isExpired()) {
            await auth.signOut();
        }
    });
}

export { SESSION_EXP_KEY };
