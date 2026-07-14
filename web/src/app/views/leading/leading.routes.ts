import { Routes } from "@angular/router";

export const leadingRoutes: Routes = [
    {
        path: "",
        loadComponent: () => import("./leading.page").then((m) => m.LeadingPage),
    },
];
