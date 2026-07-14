import { AiButton, AiInput, AiToastService, applyPasswordStrength } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { form, FormField, required, submit, validate, validateStandardSchema } from "@angular/forms/signals";
import { AuthService, makeSignUpForm, SignUpFormDto, signUpFormSchema } from "@core/secure";
import { AuthLayout, AuthLayoutConfig } from "@core/ui/layouts";

@Component({
    selector: "ai-sign-up",
    imports: [FormField, AiInput, AiButton, AuthLayout],
    template: `
        <ai-auth-layout [config]="config()">
            <ai-input class="w-full" label="Usuário" [formField]="signUpForm.name" />
            <ai-input class="w-full" type="email" label="E-mail" [formField]="signUpForm.email" />
            <ai-input
                label="Senha"
                [formField]="signUpForm.password"
                type="password"
                [strength]="true"
                class="w-full"
            />
            <ai-input
                label="Confirme a Senha"
                [formField]="signUpForm.confirmPassword"
                type="password"
                class="w-full"
            />

            <ai-button full [loading]="loading()" (click)="onSubmit()">
                {{ loading() ? "Cadastrando" : "Cadastrar" }}
            </ai-button>
        </ai-auth-layout>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpPage {
    #auth = inject(AuthService);
    #toast = inject(AiToastService);

    protected config = signal<AuthLayoutConfig>({
        title: "Cadastrar Conta",
        description: "",
        footer: {
            description: "Já possui conta?",
            label: "Acessar conta",
            routerLink: "/auth/sign-in",
        },
    });

    signUpSchema = signal<SignUpFormDto>(makeSignUpForm());

    signUpForm = form(this.signUpSchema, (schema) => {
        required(schema.name, { message: "O nome é um campo obrigatório." });
        required(schema.email, { message: "O e-mail é um campo obrigatório." });
        required(schema.password, { message: "A senha é um campo obrigatório." });
        required(schema.confirmPassword, { message: "As senhas não coincidem." });
        validateStandardSchema(schema, signUpFormSchema);
        applyPasswordStrength(schema.password, 6);
        validate(schema.confirmPassword, ({ value, valueOf }) => {
            const confirmPassword = value();
            const password = valueOf(schema.password);
            if (confirmPassword !== password) {
                return {
                    kind: "passwordMismatch",
                    message: "As senhas não coincidem.",
                };
            }
            return null;
        });
    });

    readonly loading = signal(false);

    async onSubmit() {
        this.loading.set(true);

        await submit(this.signUpForm, async () => {
            const { name, email, password } = this.signUpForm()?.value() as {
                name: string;
                email: string;
                password: string;
            };
            this.#auth.signUp({ name, email, password }).finally(() => {
                this.loading.set(false);
            });
        });

        if (this.signUpForm().invalid()) {
            this.#toast.warning({
                message: "Campos obrigatórios",
                description: "Por favor, preencha todos os campos corretamente.",
            });
            this.loading.set(false);
            return;
        }
    }
}
