import { AiButton, AiInput, AiToastService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { email, form, FormField, required, submit } from "@angular/forms/signals";
import { AuthService } from "@core/secure";
import { AuthLayout, AuthLayoutConfig } from "@core/ui/layouts";

@Component({
    selector: "ai-forgot-password",
    imports: [FormField, AiInput, AiButton, AuthLayout],
    template: `
        <ai-auth-layout [config]="config()">
            <ai-input class="w-full" type="email" label="E-mail" [formField]="forgotPasswordForm.email" />
            <ai-button full [loading]="loading()" (click)="onSubmit()">
                {{ loading() ? "Enviando" : "Enviar e-mail" }}
            </ai-button>
        </ai-auth-layout>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordPage {
    #auth = inject(AuthService);
    #toast = inject(AiToastService);

    protected config = signal<AuthLayoutConfig>({
        title: "Esqueceu a senha?",
        description: "Digite seu e-mail para redefinir sua senha.",
        footer: {
            description: "Não tem uma conta?",
            label: "Criar conta",
            routerLink: "/auth/sign-up",
        },
    });

    forgotPasswordSchema = signal<{ email: string }>({
        email: "",
    });

    forgotPasswordForm = form(this.forgotPasswordSchema, (schema) => {
        required(schema.email, { message: "O e-mail é um campo obrigatório." });
        email(schema.email, { message: "Por favor, insira um e-mail válido." });
    });

    loading = signal(false);

    async onSubmit() {
        this.loading.set(true);

        await submit(this.forgotPasswordForm, async () => {
            const { email } = this.forgotPasswordForm()?.value() as { email: string };
            await this.#auth.forgotPassword({ email }).finally(() => {
                this.loading.set(false);
            });
        });

        if (this.forgotPasswordForm().invalid()) {
            this.#toast.warning({
                message: "Campos obrigatórios",
                description: "Por favor, preencha todos os campos corretamente.",
            });
            this.loading.set(false);
            return;
        }
    }
}
