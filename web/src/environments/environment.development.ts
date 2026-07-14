import packageInfo from "@package";

export const environment = {
    production: false,

    version: packageInfo.version,

    baseUrl: "http://localhost:4201",
    apiUrl: "http://localhost:3000",
};
