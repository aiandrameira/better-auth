import { Routes } from "@angular/router";
import { isLoggedInGuard } from "@core/secure";

export const routes: Routes = [
    {
        path: "",
        redirectTo: "leading",
        pathMatch: "full",
    },
    {
        path: "auth",
        loadChildren: () => import("./views/auth/auth.routes").then((r) => r.authRoutes),
    },
    {
        path: "",
        canActivate: [isLoggedInGuard],
        children: [
            {
                path: "leading",
                loadChildren: () => import("./views/leading/leading.routes").then((r) => r.leadingRoutes),
                title: "AiAuth • Página inicial",
            },
        ],
    },
    {
        path: "**",
        loadComponent: () => import("@secure/core").then((m) => m.NotFound),
        title: "AiAuth • Página não encontrada",
    },
];
