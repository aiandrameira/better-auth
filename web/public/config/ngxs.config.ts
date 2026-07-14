import { environment } from "@env/environment.development";
import { withNgxsReduxDevtoolsPlugin } from "@ngxs/devtools-plugin";
import { withNgxsLoggerPlugin } from "@ngxs/logger-plugin";
import { withNgxsStoragePlugin } from "@ngxs/storage-plugin";
import { provideStore } from "@ngxs/store";

export const ngxsConfig = [
    provideStore(
        [], 
        withNgxsStoragePlugin({ keys: "*" }),
        withNgxsReduxDevtoolsPlugin(),
        withNgxsLoggerPlugin({
            collapsed: false,
            disabled: environment.production,
        }),
    ),
];
