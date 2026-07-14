import { catchError, throwError } from "rxjs";

import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";

import { ConnectionService } from "../services";

export const connectionInterceptor: HttpInterceptorFn = (req, next) => {
    const connectionService = inject(ConnectionService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 0) {
                connectionService.notifyOffline();
            }
            return throwError(() => error);
        }),
    );
};
