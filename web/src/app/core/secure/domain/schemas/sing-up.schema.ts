import z from "zod";

export const signUpSchema = z.object({
    name: z.string().min(1, { message: "O nome precisa ter no mínimo 3 caracteres." }).default(""),
    email: z.email({ message: "Por favor, insira um e-mail válido." }).default(""),
    password: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres." }).default(""),
});

export const signUpFormSchema = signUpSchema.extend({
    confirmPassword: z.string().min(6, { message: "O nome precisa ter no mínimo 6 caracteres." }).default(""),
});

export type SignUpFormDto = z.infer<typeof signUpFormSchema>;
export type SignUpDto = z.infer<typeof signUpSchema>;

export function makeSignUpForm(raw: Partial<SignUpFormDto> = {}): SignUpFormDto {
    return signUpFormSchema.parse(raw);
}
