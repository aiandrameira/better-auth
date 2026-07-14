import { AiToastService } from "@aiandralves/ai-ui";
import { inject, Injectable } from "@angular/core";

const NOTIFY_COOLDOWN_MS = 5000;

@Injectable({
    providedIn: "root",
})
export class ConnectionService {
    #toast = inject(AiToastService);
    #lastNotifiedAt = 0;

    notifyOffline(): void {
        const now = Date.now();
        if (now - this.#lastNotifiedAt < NOTIFY_COOLDOWN_MS) return;

        this.#lastNotifiedAt = now;
        this.#toast.destructive({
            message: "Falha de conexão",
            description: "Não foi possível conectar ao servidor. Tente novamente em instantes.",
            duration: 6000,
        });
    }
}
