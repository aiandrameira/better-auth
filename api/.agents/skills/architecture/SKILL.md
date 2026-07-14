---
name: architecture
description: Core rules for structuring a Bun + Elysia + Drizzle API into modules with domain/app/infra layers. Use this skill to determine exactly where a new backend resource (usecase, repository, controller, route, schema, dto) belongs within `src/modules/<module>`. It defines the folder structure, mandatory file naming conventions, the response envelope, error handling, and the auth/permission/org-scope plugin patterns. Triggers whenever creating or modifying a file within `src/modules`, `src/http`, or `src/db`.
license: MIT
metadata:
    author: [aiandralves](https://github.com/aiandralves)
    version: "1.0"
---

# API Architecture Guide for AIs

This document outlines the backend architecture, file structure, and naming conventions used in this project. As an AI assistant, you MUST follow these guidelines when creating or modifying files to ensure consistency across the API.

## 0. Stack

- **Runtime**: Bun.
- **HTTP framework**: Elysia, composed as small `Elysia` instances (`.use(...)`) rather than a monolithic router.
- **Database**: PostgreSQL via Drizzle ORM.
- **Validation**: Zod (request bodies/queries) — note this project targets Zod v4.
- **Auth**: better-auth, exposed as an Elysia plugin (`betterAuthPlugin`).
- **Formatting**: Biome (`bun run format`).
- **Path alias**: `@/*` maps to `./src/*` (see `tsconfig.json`).

## 1. High-Level Structure

The API is organized as a set of **modules**, each implementing its own three-layer clean/hexagonal architecture. There is no shared "core"/"domain" at the app root — each module is self-contained and owns its full vertical slice.

```
src/
    ├── modules/                # One folder per bounded-context module
    │   └── <module>/
    │       ├── domain/         # Repository interfaces (contracts), no framework code
    │       ├── app/            # Use cases, DTOs, Zod schemas — orchestration + validation
    │       └── infra/          # Concrete implementations: controllers, Drizzle repos, routes
    ├── db/                     # Drizzle schema, migrations, db client
    ├── http/                   # Cross-cutting HTTP concerns shared by all modules
    │   ├── api/                # Response envelope, shared Zod schemas (pagination, etc.)
    │   ├── errors/              # AppError hierarchy
    │   └── plugins/            # Elysia macros/plugins: auth, permission, org-scope
    ├── jobs/                   # Scheduled/cron jobs (@elysiajs/cron)
    ├── env.ts                  # Typed environment access
    └── index.ts                # Composition root: builds the Elysia app, registers module routes
```

## 2. Naming Conventions and General Rules

- **Files**: `kebab-case`, one primary export per file (e.g., `assign-role.usecase.ts`, `user.repository.ts`).
- **Classes**: `PascalCase` (e.g., `AssignRoleUseCase`, `UserDrizzleRepository`).
- **Suffixes are mandatory and describe the layer**:
    - `*.usecase.ts` → class named `<Verb><Entity>UseCase`, single public `execute(...)` method.
    - `*.repository.ts` → interface named `<Entity>Repository`, lives in `domain/repositories/`.
    - `*.drizzle.ts` → class named `<Entity>DrizzleRepository implements <Entity>Repository`, lives in `infra/repositories/`.
    - `*.controller.ts` → class named `<Entity>Controller`, lives in `infra/controllers/`.
    - `*.routes.ts` → exports a named `const <entity>Routes = new Elysia(...)`, lives in `infra/routes/`.
    - `*.schema.ts` → Zod schema(s) + inferred type(s), lives in `app/schemas/`.
    - `*.dto.ts` → plain TypeScript interface describing data shape returned to callers, lives in `app/dtos/`.
- **Repository method names** (mirrors the interface contract across all modules):
    - `find`: paginated list → returns `IPaginated<T>`.
    - `findBy*`: unpaginated list of related resources (e.g., `findByGroups`).
    - `get`: single item by id → `T | null`.
    - `getBy*`: single related item (e.g., `getByRole`).
    - `create` / `update` / `delete`: mutations.
    - Verb-first custom actions when CRUD doesn't fit (e.g., `assignRole`, `markAsRead`, `publish`).
- **Private fields**: use `private` constructor-parameter properties for injected dependencies (e.g., `constructor(private repository: UserRepository) {}`); this project does not use `#`-private fields in the API (unlike the frontend).
- **Imports**: use the `@/` alias for cross-module and `src/http`/`src/db` imports; use relative imports (`../../domain/...`) within a module's own layers.

## 3. Domain Layer (`domain/`)

The innermost layer. Contains **only interfaces** — no Drizzle, no Elysia, no I/O.

- **Repositories (`domain/repositories/`)**: One interface per aggregate/entity, named `<Entity>Repository`. Methods return `Promise<Dto>` / `Promise<Dto[]>` / `Promise<IPaginated<Dto>>`, never ORM row types directly.
- Domain files commonly re-export the DTO types they reference via `export type { ... }` so consumers can import both the repository and its shapes from one place.

```ts
// domain/repositories/user.repository.ts
export interface UserRepository {
    find(params?: PaginationParams): Promise<IPaginated<UserListItemDto>>
    get(id: string): Promise<UserDto | null>
    update(id: string, body: UpdateUserSchema): Promise<void>
    delete(id: string): Promise<void>
    findByGroups(userId: string): Promise<UserGroupDto[]>
}
```

## 4. App Layer (`app/`)

Orchestration and validation. Depends on `domain/` interfaces only — never on `infra/` concrete classes.

- **Usecases (`app/usecases/`)**: One class per action, single responsibility, named `<Verb><Entity>UseCase`. Constructor takes the repository interface(s) it needs (its own module's, and/or another module's domain repository — cross-module dependencies are allowed and common). All business rules and cross-entity checks (existence, conflicts, ownership) live here, not in controllers or repositories.

```ts
// app/usecases/assign-role.usecase.ts
export class AssignRoleUseCase {
    constructor(
        private repository: UserRepository,
        private roleRepository: UserRoleRepository,
    ) {}

    async execute(userId: string, body: AssignUserRoleSchema): Promise<void> {
        const user = await this.repository.get(userId)
        if (!user) throw new NotFoundError("User not found")
        const already = await this.roleRepository.getByRole(userId, body.roleId)
        if (already) throw new ConflictError("Role is already assigned to this user")
        return this.roleRepository.assignRole(userId, body)
    }
}
```

- **Schemas (`app/schemas/`)**: Zod object schemas for request bodies/queries, named `<verb><Entity>Schema` (e.g., `updateUserSchema`, `assignUserRoleSchema`), each paired with an inferred type export (`export type UpdateUserSchema = z.infer<typeof updateUserSchema>`).
- **DTOs (`app/dtos/`)**: Plain interfaces describing what the API returns. Prefer a distinct `*-list-item.dto.ts` for paginated list rows when the list shape is leaner than the full entity DTO (e.g., `UserListItemDto` vs `UserDto`).

## 5. Infra Layer (`infra/`)

Concrete, framework-touching implementations. This is the only layer allowed to import Drizzle, Elysia, and other modules' `infra/` classes.

- **Repositories (`infra/repositories/*.drizzle.ts`)**: Implement the module's `domain` repository interface using `db` (Drizzle client) and the tables from `src/db/schema/`. Map query results to DTOs explicitly in the `select({...})` projection — don't leak raw table row types past this layer.
- **Controllers (`infra/controllers/*.controller.ts`)**: Thin adapters between HTTP and usecases. Constructor takes a typed map of usecases (`type UseCases = { find: FindXUseCase; get: GetXUseCase; ... }`). Each method calls exactly one usecase and wraps the result with `ApiResponse` (`.paginated`, `.list`, `.item`, `.success`), or sets `set.status` directly for no-content responses (e.g., `204` on delete). No business logic here.
- **Routes (`infra/routes/*.routes.ts`)**: The composition root for the module's HTTP surface.
    - A local `buildController()` function `new`s up the concrete Drizzle repositories and usecases and wires them into the controller. This is the one place `new` is called for these classes.
    - The exported `const <entity>Routes = new Elysia({ prefix: "/<entities>", tags: ["<Entities>"] })` chains `.use(betterAuthPlugin)`, `.use(permissionPlugin)` (and `.use(orgScopePlugin)` when scoped to an organization), then one HTTP method call per endpoint.
    - Every endpoint sets `auth: true` and (unless intentionally public) a `permission: "<action>:<entity>"` string matching the `tp-`-style permission catalog, plus a Zod `body`/`query` schema when applicable, plus an OpenAPI `detail: { summary, description, responses }` block.
    - Sub-resource routes (e.g., `user-role.routes.ts`) are built the same way and mounted into the parent module's route file via `.use(subRoutes)`.

```ts
// infra/routes/user.routes.ts
function buildController() {
    const repository = new UserDrizzleRepository()
    return new UserController({
        find: new FindUsersUseCase(repository),
        get: new GetUserUseCase(repository),
        // ...
    })
}

const controller = buildController()

export const userRoutes = new Elysia({ prefix: "/users", tags: ["Users"] })
    .use(betterAuthPlugin)
    .use(permissionPlugin)
    .get("/", ({ query }) => controller.find(query), {
        auth: true,
        permission: "read:user",
        query: paginationQuerySchema,
        detail: { summary: "List users", description: "...", responses: { 200: { description: "..." } } },
    })
```

## 6. Cross-Cutting HTTP Layer (`src/http/`)

- **`http/api/response.ts`**: The `ApiResponse` envelope factory — every response body is `{ data, meta: { message, status, type } }` (plus `page`/`size`/`total` for paginated/list responses). Always return through `ApiResponse.*` from controllers; never hand-roll a response shape.
- **`http/api/schema/`**: Shared Zod schemas reused across modules (e.g., `paginationQuerySchema` / `PaginationParams`).
- **`http/errors/errors.ts`**: `AppError` base class carrying an HTTP `status`, with subclasses per case (`NotFoundError` 404, `ConflictError` 409, `ValidationError` 400, `UnauthorizedError` 401). Usecases `throw` these; a single `.onError(...)` handler in `src/index.ts` catches them, reads `.status`/`.message`, and returns `ApiResponse.error(...)`. Add new subclasses here rather than throwing plain `Error`/status codes ad hoc.
- **`http/plugins/`**: Elysia plugins exposing typed macros consumed by route definitions:
    - `better-auth.ts` → `betterAuthPlugin` (`auth: true` on a route requires a session; exposes `user` in context) and the `OpenAPI` helper used by `src/index.ts`.
    - `permission.ts` → `permissionPlugin` (`permission: "<action>:<entity>"` macro; checks the user's effective roles, `"master"` always passes).
    - `org-scope.ts` → `orgScopePlugin` (`orgScope: (ctx) => orgId | orgId[]` macro; verifies the authenticated user is a member of the resolved organization(s), `"master"` bypasses).
    - New cross-cutting concerns (rate limiting, auditing, etc.) belong here as their own plugin file, not scattered across route files.

## 7. Database Layer (`src/db/`)

- **`db/schema/*.ts`**: One file per table, `pgTable("<snake_case_table>", { ... })`, exported as a `camelCase` plural const (e.g., `export const users = pgTable("users", {...})`). Primary keys are `text("id").primaryKey().$defaultFn(() => randomUUIDv7())`. Re-export every table from `db/schema/index.ts`.
- **`db/migrations/`**: Generated by `drizzle-kit` (`bun run db:generate` / `db:migrate` / `db:push`) — do not hand-edit generated SQL.
- **`db/client.ts`**: The single shared `db` Drizzle client instance imported by every `*.drizzle.ts` repository.

## 8. Module Wiring & Boundaries

- `domain` → depends on nothing (pure interfaces + DTOs/schemas types).
- `app` → depends on `domain` (its own module's, and other modules' domain interfaces when a usecase needs cross-module data, e.g. `user/app/usecases/deny-group-role.usecase.ts` importing `group/domain/repositories/*`). Never imports another module's `infra`.
- `infra` → depends on `app` + `domain` of its own module, and may import **other modules' `infra`** (concrete Drizzle repositories, usecases) purely for wiring in `*.routes.ts` composition roots (e.g. `user-role.routes.ts` constructing a `GroupDrizzleRepository` to pass into a cross-module usecase). This is the only layer allowed to reach across modules concretely.
- `src/index.ts` is the top-level composition root: registers global plugins (`cors`, `openapi`, `.onError`, `betterAuthPlugin`, cron jobs) and mounts every module's `*.routes.ts` via `.use(...)`.

## 9. Coding Standards Checklist for AIs

When generating new code in this project:

- **New endpoint** → add (as needed) a DTO, a Zod schema, a usecase, a repository method (interface + Drizzle impl), a controller method, and a route — in that dependency order.
- **Business rules** (existence checks, conflicts, authorization beyond permission strings) belong in the **usecase**, not the controller or the Drizzle repository.
- **Errors**: throw the specific `AppError` subclass (`NotFoundError`, `ConflictError`, etc.) from `http/errors/errors.ts`; let `src/index.ts`'s `.onError` translate it — don't catch-and-format errors manually in controllers.
- **Responses**: always go through `ApiResponse.paginated/list/item/success/error`.
- **Routes**: every protected route needs `auth: true`; every permission-gated route needs `permission: "<action>:<entity>"`; every organization-scoped route needs `orgScope`; every route needs an OpenAPI `detail` block.
- **Repositories**: never return raw Drizzle row/table types from a `domain` interface method — always map to a DTO in the `.drizzle.ts` implementation.
- **Validation**: request bodies/queries are validated by Zod schemas passed to Elysia's `body`/`query` route options — don't manually validate inside usecases/controllers.
- **Testing**: this project has no test suite yet; if adding one, colocate `*.spec.ts`/`*.test.ts` next to the file under test, matching Bun's test runner conventions.
