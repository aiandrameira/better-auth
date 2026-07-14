import { AiToast } from "@aiandralves/ai-ui";
import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { SessionExpiry } from "@core/secure";

@Component({
    selector: "app-root",
    imports: [RouterOutlet, AiToast, SessionExpiry],
    template: `
        <ai-toast />
        <ai-session-expiry />
        <router-outlet />
    `,
})
export class App {}
