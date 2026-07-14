import { AiButton, AiIcon, AiProgressBar, AiToastService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from "@angular/core";

import { AuthService } from "../../../../infra/services/auth.service";
import { JwtService } from "../../../../infra/services/jwt.service";
import { DurationPipe } from "../../../pipes/duration.pipe";

@Component({
    selector: "ai-session-expiry",
    imports: [DurationPipe, AiIcon, AiButton, AiProgressBar],
    templateUrl: "./session-expiry.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionExpiry {
    #jwt = inject(JwtService);
    #auth = inject(AuthService);
    #toast = inject(AiToastService);

    protected readonly dismissed = signal(false);

    protected readonly isWarning = this.#jwt.isWarning;
    protected readonly isCritical = computed(() => this.#jwt.warningProgress() <= 30);
    protected readonly remainingTime = this.#jwt.remainingTime;
    protected readonly warningProgress = this.#jwt.warningProgress;

    #toastFired = false;

    constructor() {
        effect(() => {
            if (this.#jwt.hasActiveSession() && this.#jwt.isExpired()) {
                this.#auth.signOut();
            }
        });

        effect(() => {
            if (this.#jwt.isToastWarning() && !this.#toastFired) {
                this.#toastFired = true;
                this.#toast.info({
                    message: "Sessão expirando",
                    description: "Sua sessão expira em menos de 2 minutos.",
                    duration: 6000,
                });
            }

            if (!this.#jwt.isToastWarning() && !this.isWarning()) {
                this.#toastFired = false;
            }
        });

        effect(() => {
            if (!this.isWarning() && this.dismissed()) {
                this.dismissed.set(false);
            }
        });
    }

    protected dismiss(): void {
        this.dismissed.set(true);
    }

    protected async renew(): Promise<void> {
        await this.#auth.renewSession();
    }

    protected async leave(): Promise<void> {
        await this.#auth.signOut();
    }
}
