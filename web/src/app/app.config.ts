import { ApplicationConfig, provideBrowserGlobalErrorListeners } from "@angular/core";
import { provideRouter } from "@angular/router";
import { ngxsConfig } from "@public/config";

import { provideAiAuth } from "@core/secure";
import { environment } from "@env/environment.development";
import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes),
        ...ngxsConfig,
        ...provideAiAuth({ baseUrl: environment.baseUrl, apiUrl: environment.apiUrl, version: environment.version }),
    ],
};
