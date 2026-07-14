import { Routes } from "@angular/router";

export const authRoutes: Routes = [
    {
        path: "",
        redirectTo: "sign-in",
        pathMatch: "full",
    },
    {
        path: "",
        children: [
            {
                path: "sign-in",
                loadComponent: () => import("./pages/sign-in/sign-in.page").then((m) => m.SignInPage),
                title: "AiAuth • Acessar",
            },
            {
                path: "sign-up",
                loadComponent: () => import("./pages/sign-up/sign-up.page").then((m) => m.SignUpPage),
                title: "AiAuth • Criar conta",
            },
            {
                path: "forgot-password",
                loadComponent: () =>
                    import("./pages/forgot-password/forgot-password.page").then((m) => m.ForgotPasswordPage),
                title: "AiAuth • Esqueci a senha",
            },
            {
                path: "reset-password",
                loadComponent: () =>
                    import("./pages/reset-password/reset-password.page").then((m) => m.ResetPasswordPage),
                title: "AiAuth • Redefinir senha",
            },
        ],
    },
];
