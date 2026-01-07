# Component Architecture

This project follows a component architecture designed for scalability, reusability, and maintainability.

## Folder Structure

```
src/components/
├── ui/              # Primitive components (buttons, badges, generic tables, etc.)
├── layout/          # Layout components (Sidebar, Navbar, Footer)
├── features/        # Feature-specific components (Auth, Users, Billing)
├── sections/        # Section-level components (Hero, Pricing, Stats) - Compositional
└── ...
```

## Naming Conventions

- **PascalCase** for proper component filenames (e.g., `BrandLogo.vue`, `UserFormModal.vue`).
- **Base** prefix for base/primitive components (optional, but good for differentiation, e.g., `BaseButton.vue`).
- Feature components should be grouped in their respective folders (`features/auth/LogoutModal.vue`).

## Categories & Responsibilities

### 1. UI Primitives (`components/ui`)
- **Single Responsibility**: Render a basic UI element.
- **Framework Agnostic**: Should abstract away the underlying library (e.g., Nuxt UI, Tailwind) where possible, allowing easier changes later.
- **Props**: Receives all data via props. No API calls inside.
- **Example**: `BrandLogo`, `BaseDataTable`.

### 2. Layout Components (`components/layout`)
- **Responsibility**: Define the scaffold of the application.
- **Content**: Sidebar, Header, Footer.
- **State**: Can handle layout-specific state (collapsible sidebar).

### 3. Feature Components (`components/features`)
- **Responsibility**: Encapsulate specific domain logic.
- **Content**: Components related to a specific feature (e.g., `UserFormModal` for Users feature, `LogoutModal` for Auth).
- **Organization**: Grouped by domain (auth, users, billing, etc.).

### 4. Section Components (`components/sections`)
- **Responsibility**: Compositional components for building pages (especially landing pages).
- **Structure**: typically full-width sections like a Hero banner or Features grid.

## Best Practices

1.  **Strict Separation**: Do not import `features` inside `ui` primitives. `ui` components should be leaf nodes in the dependency graph.
2.  **Props & Events**: Use Props for data down, Events (emits) for actions up.
3.  **Clean Imports**: Use `@/components/ui/...` or `@/components/features/...` aliases.
4.  **Extensibility**:
    - Use Slots for dynamic content.
    - Export types for Props if complex.
