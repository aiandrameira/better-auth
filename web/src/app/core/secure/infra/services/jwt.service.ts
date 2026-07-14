import { computed, Injectable, signal } from "@angular/core";

const TOAST_THRESHOLD_MS = 2 * 60 * 1000; // show toast at 2 minutes
const WARNING_THRESHOLD_MS = 1 * 60 * 1000; // show modal at 1 minute

@Injectable({
    providedIn: "root",
})
export class JwtService {
    readonly #expiresAt = signal<string | null>(null);

    readonly #now = signal(Date.now());

    readonly remainingTime = computed(() => {
        const expiresAt = this.#expiresAt();
        return !expiresAt ? 0 : new Date(expiresAt).getTime() - this.#now();
    });

    readonly hasActiveSession = computed(() => this.#expiresAt() !== null);

    readonly isExpired = computed(() => this.remainingTime() <= 0);

    readonly isToastWarning = computed(
        () =>
            this.hasActiveSession() &&
            this.remainingTime() > WARNING_THRESHOLD_MS &&
            this.remainingTime() <= TOAST_THRESHOLD_MS,
    );

    readonly isWarning = computed(
        () => this.hasActiveSession() && this.remainingTime() > 0 && this.remainingTime() <= WARNING_THRESHOLD_MS,
    );

    readonly warningProgress = computed(() => {
        const remaining = Math.max(0, this.remainingTime());
        return Math.min(100, (remaining / WARNING_THRESHOLD_MS) * 100);
    });

    constructor() {
        setInterval(() => this.#now.set(Date.now()), 1000);
    }

    setExpiresAt(expiresAt: string): void {
        this.#expiresAt.set(expiresAt);
    }

    clear(): void {
        this.#expiresAt.set(null);
    }
}
