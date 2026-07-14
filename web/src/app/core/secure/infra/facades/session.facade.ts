import { AiAlertDialogService, AiDialogService, ThemeStore } from "@aiandralves/ai-ui";
import { computed, inject, Injectable, signal } from "@angular/core";

import { DialogProfile, getDisplayName, getInitials } from "../../core";
import { DialogProfileData, SessionResponseDto } from "../../domain";
import { AI_AUTH_CONFIG } from "../config";
import { AuthService, ConnectionService, JwtService } from "../services";

@Injectable({
    providedIn: "root",
})
export class SessionFacade {
    readonly #auth = inject(AuthService);
    readonly #jwtService = inject(JwtService);
    readonly #themeStore = inject(ThemeStore);
    readonly #alertDialog = inject(AiAlertDialogService);
    readonly #dialogService = inject(AiDialogService);
    readonly #connection = inject(ConnectionService);

    readonly theme = this.#themeStore.theme;
    readonly expiration = this.#jwtService.remainingTime;
    readonly url = inject(AI_AUTH_CONFIG).baseUrl;

    readonly session = signal<SessionResponseDto | null>(null);

    readonly userInitials = computed(() => getInitials(this.session()?.user?.name));
    readonly userDisplayName = computed(() => getDisplayName(this.session()?.user?.name));

    constructor() {
        this._loadSession();
    }

    onChangeTheme(): void {
        const current = this.#themeStore.theme();
        this.#themeStore.changeTo(current === "light" ? "dark" : "light");
    }

    confirmSignOut() {
        this.#alertDialog.confirm({
            icon: { name: "emotion-unhappy", color: "warning" },
            title: "Sair do sistema",
            description: "Tem certeza que deseja sair?",
            confirmText: "Sim, sair",
            cancelText: "Cancelar",
            onConfirm: () => this.#auth.signOut(),
        });
    }

    openProfileDialog(): void {
        const user = this.session()?.user;
        if (!user) return;

        this.#dialogService.create<DialogProfile, DialogProfileData>({
            title: "Meu perfil",
            icon: "profile",
            description:
                "Atualize seu nome de exibição. As alterações são refletidas imediatamente em toda a plataforma.",
            component: DialogProfile,
            btnShape: "circle",
            btnSize: "sm",
            hideCancelButton: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                emailVerified: user.emailVerified,
                onSaved: () => this._loadSession(),
            },
            hideFooter: true,
            width: "440px",
        });
    }

    private async _loadSession(): Promise<void> {
        try {
            const session = await this.#auth.getSession();
            this.session.set(session as unknown as SessionResponseDto);
        } catch {
            this.#connection.notifyOffline();
        }
    }
}
