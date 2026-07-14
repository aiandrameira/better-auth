import { FilterManager } from "./interface/filter-manage.interface";
import { Filter } from "./interface/filter.interface";

/**
 * Classe responsável por armazenar as informações dos filtros necessários para as pesquisas
 */
export class HttpFilter implements FilterManager {
    private filters: Filter<unknown>[];

    constructor(filters?: Filter<unknown>[]) {
        this.filters = filters || [];
    }

    buildFilters(): string {
        const params = new URLSearchParams();

        this.filters.forEach((filter) => {
            if (filter.validate()) {
                params.append(filter.field, String(filter.value));
            }
        });

        const query = params.toString();
        return query ? `?${query}` : "";
    }

    addFilter<T>(filter: Filter<T>): void {
        this.filters.push(filter);
    }
}
