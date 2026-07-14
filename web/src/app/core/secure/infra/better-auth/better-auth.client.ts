import { createAuthClient } from "better-auth/client";

import { inject, Injectable } from "@angular/core";

import { AI_AUTH_CONFIG } from "../config";

type AuthClientInstance = ReturnType<typeof createAuthClient>;

export type GetSessionResponse = Awaited<ReturnType<AuthClientInstance["getSession"]>>;
export type SignInResponse = Awaited<ReturnType<AuthClientInstance["signIn"]["email"]>>;
export type SignUpResponse = Awaited<ReturnType<AuthClientInstance["signUp"]["email"]>>;
export type SignOutResponse = Awaited<ReturnType<AuthClientInstance["signOut"]>>;
export type SocialSignInResponse = Awaited<ReturnType<AuthClientInstance["signIn"]["social"]>>;

@Injectable({
    providedIn: "root",
})
export class BetterAuthClient {
    readonly #config = inject(AI_AUTH_CONFIG);
    readonly #client: AuthClientInstance = createAuthClient({ baseURL: this.#config.apiUrl, plugins: [] });

    getSession(): Promise<GetSessionResponse> {
        return this.#client.getSession();
    }

    refreshSession(): Promise<GetSessionResponse> {
        return this.#client.getSession({
            query: { disableCookieCache: true },
            fetchOptions: { cache: "no-store" },
        });
    }

    signIn(credentials: { email: string; password: string }): Promise<SignInResponse> {
        return this.#client.signIn.email({
            ...credentials,
            callbackURL: this.#config.baseUrl,
        });
    }

    signUp(data: { name: string; email: string; password: string }): Promise<SignUpResponse> {
        return this.#client.signUp.email({
            ...data,
            callbackURL: this.#config.baseUrl,
        });
    }

    signOut(): Promise<SignOutResponse> {
        return this.#client.signOut();
    }

    signInGoogle(): Promise<SocialSignInResponse> {
        return this.#client.signIn.social({ provider: "google", callbackURL: this.#config.baseUrl });
    }

    forgotPassword(data: { email: string }): Promise<SignInResponse> {
        return this.#client.requestPasswordReset({
            ...data,
            redirectTo: `${this.#config.baseUrl}/auth/reset-password`,
        });
    }

    resetPassword(data: { token: string; password: string }): Promise<SignInResponse> {
        return this.#client.resetPassword({ newPassword: data.password, token: data.token });
    }
}
