import { inject } from "@angular/core";

import { BetterAuthClient } from "./better-auth.client";

export const injectBetterAuthClient = () => {
    const client = inject(BetterAuthClient);
    if (!client) {
        throw new Error("BetterAuthClient not found. Make sure to provide it in the module.");
    }
    return client;
};
