import { AiButton, AiCard } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";

export interface AuthLayoutConfig {
    title: string;
    description?: string;
    footer: {
        routerLink: string;
        description: string;
        label: string;
    };
}

@Component({
    selector: "ai-auth-layout",
    imports: [AiCard, RouterLink, AiButton],
    template: `
        <div class="max-w-sm mx-auto flex flex-col justify-center items-center h-screen gap-y-6">
            <ai-card class=" py-8 px-4 bg-background">
                <div class="flex flex-col gap-y-4">
                    <div class="space-y-1">
                        <h2 class="text-2xl font-bold font-title text-center text-primary">
                            {{ config().title }}
                        </h2>
                        <p class="text-center text-muted-foreground font-semibold mb-2">
                            {{ config().description ?? "" }}
                        </p>
                    </div>

                    <ng-content />

                    @let footer = config().footer;
                    <span class="text-center text-sm font-semibold">
                        {{ footer.description }}
                        <a ai-button variant="link" class="px-1" [routerLink]="footer.routerLink">
                            {{ footer.label }}
                        </a>
                    </span>
                </div>
            </ai-card>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayout {
    config = input.required<AuthLayoutConfig>();
}
