import { AiToastService } from "@aiandralves/ai-ui";
import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { SessionResponseDto, SignInDto, SignUpDto } from "../../domain";
import { injectBetterAuthClient } from "../better-auth";
import { AI_AUTH_CONFIG } from "../config";
import { SESSION_EXP_KEY } from "../initializers";
import { JwtService } from "./jwt.service";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    readonly #client = injectBetterAuthClient();
    readonly #router = inject(Router);
    readonly #toast = inject(AiToastService);
    readonly #jwt = inject(JwtService);
    readonly #baseUrl = inject(AI_AUTH_CONFIG).baseUrl;

    private _navigateToSignIn(): void {
        if (this.#baseUrl === window.location.origin) {
            this.#router.navigate(["/auth/sign-in"]);
        } else {
            window.location.href = `${this.#baseUrl}/auth/sign-in`;
        }
    }

    async getSession(): Promise<SessionResponseDto | null> {
        const { data } = await this.#client.getSession();
        return data as unknown as SessionResponseDto | null;
    }

    async signIn({ email, password }: SignInDto): Promise<void> {
        const { error } = await this.#client.signIn({ email, password });
        if (error) {
            this.#toast.destructive({ message: "Erro", description: error.message ?? "Falha ao logar" });
            return;
        }
    }

    async signUp({ name, email, password }: SignUpDto): Promise<void> {
        const { error } = await this.#client.signUp({ name, email, password });
        if (error) {
            this.#toast.destructive({ message: "Erro", description: error.message ?? "Falha ao cadastrar" });
            return;
        }
        this.#toast.default({
            icon: "alert",
            message: "Importante",
            description: "Após o cadastro, verifique seu email para confirmar sua conta.",
            duration: 5000,
        });
        this._navigateToSignIn();
    }

    async forgotPassword({ email }: { email: string }): Promise<void> {
        const { error } = await this.#client.forgotPassword({ email });
        if (error) {
            this.#toast.destructive({ message: "Erro", description: error.message ?? "Falha ao enviar email" });
            return;
        }
        this.#toast.default({
            icon: "alert",
            message: "Email enviado",
            description: "Verifique seu email para redefinir sua senha.",
            duration: 5000,
        });
    }

    async resetPassword({ password }: { password: string }): Promise<void> {
        const token = new URLSearchParams(window.location.search).get("token");
        if (!token) {
            this.#toast.destructive({ message: "Erro", description: "Token inválido" });
            return;
        }
        const { error } = await this.#client.resetPassword({ password, token });
        if (error) {
            this.#toast.destructive({ message: "Erro", description: error.message ?? "Falha ao redefinir senha" });
            return;
        }
        this.#toast.default({
            icon: "check",
            message: "Senha redefinida",
            description: "Sua senha foi redefinida com sucesso. Faça login com sua nova senha.",
            duration: 5000,
        });
        this._navigateToSignIn();
    }

    async signOut(): Promise<void> {
        sessionStorage.removeItem(SESSION_EXP_KEY);
        this.#jwt.clear();
        await this.#client.signOut();
        this._navigateToSignIn();
    }

    async renewSession(): Promise<void> {
        const { data } = await this.#client.refreshSession();
        if (!data?.session) {
            await this.signOut();
            return;
        }
        const expiresAt = String(data.session.expiresAt);
        sessionStorage.setItem(SESSION_EXP_KEY, expiresAt);
        this.#jwt.setExpiresAt(expiresAt);
        this.#toast.default({ message: "Sessão renovada", description: "Sua sessão foi renovada com sucesso." });
    }

    async signInGoogle(): Promise<void> {
        await this.#client.signInGoogle();
    }
}
