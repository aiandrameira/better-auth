## Introdução

A classe `FilterProps` é responsável por armazenar as informações dos filtros necessários para as pesquisas, utilizando os props passados para criar os filtros. Ela possui um método `getFilters()` que retorna um objeto do tipo `FilterManager`, contendo os filtros construídos a partir dos props.

### Exemplo de uso

```typescript
import { FilterProps, FilterManager } from "./filter/interface";

// Suponha que temos um tipo de props para os filtros
interface UserFilterProps {
    name: string;
    age: number;
    isActive: boolean;
}

export class UserFilter {
    props: UserFilterProps;

    constructor(props: UserFilterProps) {
        this.props = props;
    }

    getFilters(): FilterManager {
        return new FilterProps<UserFilterProps>(this.props).getFilters();
    }
}
```
