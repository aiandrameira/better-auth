import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from "@angular/core";

import { provideAuthInitializer } from "../initializers";
import { authInterceptor, connectionInterceptor } from "../interceptors";

export interface AiAuthConfig {
    baseUrl: string;
    apiUrl: string;
    version?: string;
}

export const AI_AUTH_CONFIG = new InjectionToken<AiAuthConfig>("AI_AUTH_CONFIG");

/**
 * Provides the ai-auth library configuration, http interceptor, session initializer and permission service.
 * @param config baseUrl/apiUrl used by the auth client, session facade and permission service
 */
export function provideAiAuth(config: AiAuthConfig): EnvironmentProviders[] {
    return [
        makeEnvironmentProviders([
            { provide: AI_AUTH_CONFIG, useValue: config },
            provideAuthInitializer(),
            provideHttpClient(withInterceptors([authInterceptor, connectionInterceptor])),
        ]),
    ];
}
