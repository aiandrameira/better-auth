import { AiButton, AiInput, AiToastService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { email, form, FormField, required, submit } from "@angular/forms/signals";
import { RouterLink } from "@angular/router";
import { AuthService } from "@core/secure";
import { AuthLayout, AuthLayoutConfig } from "@core/ui/layouts";

@Component({
    selector: "ai-sign-in",
    imports: [FormField, AiInput, AiButton, AuthLayout, RouterLink],
    template: `
        <ai-auth-layout [config]="config()">
            <ai-button icon="google" variant="outline" (click)="signInGoogle()">Acessar pelo Google</ai-button>

            <span class="flex items-center gap-x-1">
                <span class="h-px w-full bg-border"></span>
                <span class="text-sm w-100 text-center text-muted-foreground pb-1">ou continue com</span>
                <span class="h-px w-full bg-border"></span>
            </span>

            <ai-input class="w-full" label="Email" [formField]="signInForm.email" />
            <ai-input class="w-full" type="password" label="Password" [formField]="signInForm.password" />

            <div class="flex justify-end -mt-4">
                <a ai-button variant="link" class="px-1" routerLink="/auth/forgot-password">Esqueceu sua senha?</a>
            </div>

            <ai-button full [loading]="loading()" (click)="onSubmit()">
                {{ loading() ? "Acessando" : "Acessar" }}
            </ai-button>
        </ai-auth-layout>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInPage {
    #auth = inject(AuthService);
    #toast = inject(AiToastService);

    protected config = signal<AuthLayoutConfig>({
        title: "Acessar Conta",
        description: "",
        footer: {
            description: "Não tem uma conta?",
            label: "Criar conta",
            routerLink: "/auth/sign-up",
        },
    });

    signInSchema = signal<{ email: string; password: string }>({
        email: "",
        password: "",
    });

    signInForm = form(this.signInSchema, (schema) => {
        required(schema.email, { message: "O email é um campo obrigatório." });
        email(schema.email, { message: "Por favor, insira um email válido." });
        required(schema.password, { message: "A senha é um campo obrigatório." });
    });

    readonly loading = signal(false);

    async onSubmit() {
        this.loading.set(true);

        await submit(this.signInForm, async () => {
            const { email, password } = this.signInForm()?.value() as { email: string; password: string };
            await this.#auth.signIn({ email, password }).finally(() => {
                this.loading.set(false);
            });
        });

        if (this.signInForm().invalid()) {
            this.#toast.warning({
                message: "Campos obrigatórios",
                description: "Por favor, preencha todos os campos corretamente.",
            });
            this.loading.set(false);
            return;
        }
    }

    signInGoogle() {
        this.#auth.signInGoogle();
    }
}
