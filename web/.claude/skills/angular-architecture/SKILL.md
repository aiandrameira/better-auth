---
name: architecture
description: Core rules for structuring an Angular workspace into core, domain, infra, and presentation directories. Use this skill to determine exactly where a new Angular resource belongs within the `src/app` folder. It defines the folder structure, mandatory file naming conventions, and patterns like Zod schemas, NGXS stores, Facades, dumb/smart components, and the usage of Signals and inject(). Triggers whenever creating or modifying a file within `src/app`.
license: MIT
metadata:
    author: [aiandralves](https://github.com/aiandralves)
    version: "1.0"
---

# Angular Architecture Guide for AIs

This document outlines the specific Angular architecture, file structure, and naming conventions used in this project based on the official team guidelines. As an AI assistant, you MUST follow these guidelines when creating or modifying files to ensure consistency across the application.

## 1. High-Level Folder Structure

The application strictly uses four layers, each with specific responsibilities:

- **`core/`**: Utilities, helpers, pipes, and atomic UI components.
- **`domain/`**: Business logic, models, validation schemas, filters, enums, and repository interfaces. Independent of frameworks.
- **`infra/`**: Concrete implementations: external services, state stores, adapters, and facades.
- **`views/`**: UI layer containing pages, visual components, and routes. Depends only on `domain/` and `infra/`.

## 2. Naming Conventions and General Rules

- **Files**: Singular and `kebab-case` (e.g., `user.service.ts`).
- **Classes**: `PascalCase` (e.g., `UserService`).
- **Variables/Functions**: `camelCase` (e.g., `getUserById`).
- **Private Methods**: Must be prefixed with an underscore (`_`) to clearly distinguish them from private properties (e.g., `private _loadUser()`).
- **Private Properties**: Must use ECMAScript private fields (`#`) instead of the `private` keyword (e.g., `#apiUrl = ''`, `#http = inject(HttpClient)`).
- **Enums**:
    - `tp-` for types/enums (e.g., `tp-user.enum.ts`)
    - `st-` for status (e.g., `st-order.enum.ts`)
    - `lg-` for logical flags (e.g., `lg-active.enum.ts`)
    - Associated maps should be exported (e.g., `export const tpUserMap = new Map(...)`).
- **Repository Methods**:
    - `find`: returns a list
    - `get`: returns a single item
    - `create`: creates an entity
    - `update`: updates an entity
    - `remove`: deletes an entity
    - `download`: downloads files
    - `findBy*`: list of related resources
    - `getBy*`: single related resource
- **Dependency Injection**: Always use `inject()` function over constructor injection.

## 3. Core Layer (`core/`)

- **Utils (`core/utils/`)**: Pure functions and helpers that are framework-agnostic;
- **Helpers (`core/helpers/`)**: Functions that may depend on Angular but are not specific to business logic (e.g., `formatDayjs`, `handleError`);
- **Pipes (`core/pipes/`)**: Reusable Angular pipes for formatting and transforming data in templates;
- **UI (`core/ui/`)**: Atomic, reusable UI components that do not depend on specific business logic. They should be designed to be as generic as possible and should not contain any domain-specific logic. Examples include buttons, form controls, and layout components.

Structure:

```
core/
    ├── utils/                          # Pure functions and helpers
    │   └── string.util.ts              # e.g., `string.util.ts`
    ├── helpers/                        # Functions that may depend on Angular but are not specific to business logic
    │   └── format-dayjs.helper.ts      # e.g., `formatDayjs.helper.ts`
    ├── pipes/                          # Reusable Angular pipes
    │   └── tp-user.pipe.ts             # e.g., `tp-user.pipe.ts`
    └── ui/                             # Atomic, reusable UI components
        └── components/                 # Reusable components
        └── lib/                        # Shared modules, directives, and other UI-related utilities

```

## 4. Domain Layer (`domain/`)

- **Schemas (`domain/schemas/`)**: Use `zod` for validation. Export the schema, the TypeScript type inferred via `z.infer`, and a factory function (e.g., `makeUser`) to parse raw data and instantiate default states for UI;
- **Repositories (`domain/repositories/`)**: Interfaces defining data contracts returning Observables (e.g., `UserRepository`);
- **Filters (`domain/filters/`)**: Implement classes that handle search criteria. They should use `zod` for prop validation and `FilterManager` to mount query params;
- **Enums (`domain/enums/`)**: Definition of constant values and maps for UI display.

Structure:

```
domain/
    ├── schemas/                        # Zod schemas with inferred types and factory functions
    │   └── entity.schema.ts            # e.g., `user.schema.ts`
    ├── repositories/                   # Repository interfaces returning Observables
    │   └── entity.repository.ts        # e.g., `user.repository.ts`
    ├── filters/                        # Filter classes using zod and FilterManager
    │   └── entity.filter.ts            # e.g., `user.filter.ts`
    └── enums/                          # Enums and associated maps for UI
        └── tp-entity.enum.ts           # e.g., `tp-user.enum.ts`
```

## 5. Infra Layer (`infra/`)

- **Services (`infra/services/`)**: Implement Domain Repository interfaces. Handle HTTP requests (using `#client = inject(Client)`). Group files by entity (e.g., `services/user/user.service.ts` and `.spec.ts`);
- **Facades (`infra/facades/`)**: Encapsulate logic for external services to avoid bloating components, often orchestrating Services and Stores;
- **Stores (`infra/stores/`)**: State management using **NGXS**. Each entity has a folder (e.g., `stores/user/`) containing:
    - `*.action.ts`: Actions (e.g., `SetUserFilterAction`, `ClearUserAction`);
    - `*.state.ts`: The state class responding to actions using `@State` and `@Action`.

_Note: Provide barrel files (`index.ts`) for public folders to export relevant symbols._

Structure:

```
infra/
    ├── services/
    │   └── entity/                     # Grouped by entity (e.g., `user/`)
    │       ├── entity.service.ts
    │       └── entity.service.spec.ts
    ├── facades/                        # Facades for external services
    │   └── entity.facade.ts
    └── stores/                         # NGXS state management
        └── entity/                     # Grouped by entity (e.g., `user/`)
            ├── entity.action.ts        # Actions for the entity
            └── entity.state.ts         # State class with @State and @Action handlers
```

## 6. Views Layer (`views/`)

The views layer orchestrates the UI using dumb and smart components, using modern Angular features like **Signals** (`signal()`, `computed()`), Signal inputs (`input()`, `output()`).

Structure:

```
views/
    ├── module/                 # Angular module definition (e.g., `control`)
        └── submodule/          # Submodule for specific features (e.g., `user`)
            ├── pages/          # Page components (e.g., `search-user.page.ts`)
            ├── components/     # Reusable visual components (e.g., `table-user.ts`)
            └── routes.ts       # Route definitions for the submodule (e.g., `user.routes.ts`)
        ├── routes.ts           # Route definitions for the module (e.g., `control.routes.ts`)
```

## 7. Coding Standards Checklist for AIs

When generating new code in this project:

- **Standalone Components:** DO NOT use `standalone: true`;
- **Imports:** Use absolute-like or relative paths correctly, keeping boundaries strict (Features can import from Core, but Core NEVER imports from Features);
- **State Management:** Prioritize using Angular **Signals** (`signal()`, `computed()`, `effect()`) for state over Observables/BehaviorSubjects;
- **Dependency Injection:** Use the `inject()` function pattern over constructor injection;
- **Forms:** Use signal-based forms (e.g., `form()`, `FormField`) when building inputs;
- **Private Properties:** Use ECMAScript private fields (`#property`) instead of the `private` keyword.
- **Private Methods:** Prefix private methods with an underscore (`private _methodName()`).
