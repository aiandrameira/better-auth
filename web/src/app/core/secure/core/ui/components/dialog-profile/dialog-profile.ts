import { AI_DIALOG_DATA, AiAvatar, AiButton, AiDialogRef, AiIcon, AiInput, AiToastService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { disabled, form, FormField, minLength, required } from "@angular/forms/signals";

import { DialogProfileData } from "../../../../domain";
import { ProfileService } from "../../../../infra/services";
import { getInitials } from "../../../helpers";

@Component({
    selector: "ai-dialog-profile",
    imports: [FormField, AiInput, AiButton, AiAvatar, AiIcon],
    templateUrl: "./dialog-profile.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogProfile {
    readonly data = inject<DialogProfileData>(AI_DIALOG_DATA as never);

    #profileService = inject(ProfileService);
    #toast = inject(AiToastService);
    #dialogRef = inject(AiDialogRef<DialogProfile>);

    readonly loading = signal(false);

    readonly initials = computed(() => getInitials(this.data.name));

    protected schema = signal<{ name: string; email: string }>({
        name: this.data.name,
        email: this.data.email,
    });

    readonly form = form(this.schema, (schema) => {
        disabled(schema.email);
        required(schema.name, { message: "O nome é obrigatório." });
        minLength(schema.name, 3, { message: "O nome deve conter no mínimo 3 caracteres." });
    });

    onCancel(): void {
        this.#dialogRef.close();
    }

    onSave(): void {
        if (this.form().invalid()) return;

        this.loading.set(true);
        const { name } = this.form().value() as { name: string };

        this.#profileService.update(this.data.id, name).subscribe({
            next: () => {
                this.#toast.success({ message: "Perfil atualizado com sucesso." });
                this.data.onSaved?.();
                this.#dialogRef.close();
            },
            error: () => {
                this.loading.set(false);
            },
        });
    }
}
