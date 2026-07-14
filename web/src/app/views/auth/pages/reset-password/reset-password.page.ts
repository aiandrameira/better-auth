import { AiButton, AiInput, AiToastService, applyPasswordStrength } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { form, FormField, minLength, required, submit, validate } from "@angular/forms/signals";
import { AuthService } from "@core/secure";
import { AuthLayout, AuthLayoutConfig } from "@core/ui/layouts";

@Component({
    selector: "ai-reset-password",
    imports: [FormField, AiInput, AiButton, AuthLayout],
    template: `
        <ai-auth-layout [config]="config()">
            <ai-input
                label="Nova senha"
                [formField]="resetPasswordForm.password"
                type="password"
                [strength]="true"
                class="w-full"
            />
            <ai-input
                label="Confirme a Senha"
                [formField]="resetPasswordForm.confirmPassword"
                type="password"
                class="w-full"
            />

            <ai-button full [loading]="loading()" (click)="onSubmit()">
                {{ loading() ? "Redefinindo" : "Redefinir senha" }}
            </ai-button>
        </ai-auth-layout>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordPage {
    #auth = inject(AuthService);
    #toast = inject(AiToastService);

    protected config = signal<AuthLayoutConfig>({
        title: "Redefinir senha",
        description: "Digite sua nova senha e confirme-a.",
        footer: {
            description: "Não tem uma conta?",
            label: "Criar conta",
            routerLink: "/auth/sign-up",
        },
    });

    resetPasswordSchema = signal<{ password: string; confirmPassword: string }>({
        password: "",
        confirmPassword: "",
    });

    resetPasswordForm = form(this.resetPasswordSchema, (schema) => {
        required(schema.password, { message: "A senha é um campo obrigatório." });
        required(schema.confirmPassword, { message: "Por favor, confirme sua senha." });
        minLength(schema.password, 6, { message: "A senha deve ter no mínimo 6 caracteres." });
        applyPasswordStrength(schema.password, 6);
        validate(schema.confirmPassword, ({ value, valueOf }) => {
            const confirmPassword = value();
            const password = valueOf(schema.password);
            if (confirmPassword !== password) {
                return {
                    kind: "passwordMismatch",
                    message: "Por favor, confirme sua senha.",
                };
            }
            return null;
        });
    });

    loading = signal(false);

    async onSubmit() {
        this.loading.set(true);

        await submit(this.resetPasswordForm, async () => {
            const { password } = this.resetPasswordForm()?.value() as { password: string };
            await this.#auth.resetPassword({ password }).finally(() => {
                this.loading.set(false);
            });
        });

        if (this.resetPasswordForm().invalid()) {
            this.#toast.warning({
                message: "Campos obrigatórios",
                description: "Por favor, preencha todos os campos corretamente.",
            });
            this.loading.set(false);
            return;
        }
    }
}
