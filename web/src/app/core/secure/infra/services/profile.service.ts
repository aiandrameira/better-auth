import { Observable } from "rxjs";

import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { AI_AUTH_CONFIG } from "../config";

@Injectable({
    providedIn: "root",
})
export class ProfileService {
    #client = inject(HttpClient);
    #api = inject(AI_AUTH_CONFIG).apiUrl.concat("/users");

    update(id: string, name: string): Observable<void> {
        return this.#client.patch<void>(`${this.#api}/${id}`, { name });
    }
}
