# Monorepo Mixed Example

This example demonstrates a complete monorepo setup with Vite Enhance Kit, showcasing:

- **Shared packages**: Common utilities and types
- **UI library**: Reusable Vue components
- **Multiple applications**: Web app and admin dashboard

## Structure

```
monorepo-mixed/
├── packages/
│   ├── shared/          # Shared utilities and types
│   └── ui-lib/          # Vue component library
├── apps/
│   ├── web-app/         # Main web application
│   └── admin-app/       # Admin dashboard
└── pnpm-workspace.yaml  # Workspace configuration
```

## Features

### Shared Package (`@monorepo-mixed/shared`)
- Common TypeScript types (`User`, `ApiResponse`)
- Utility functions (`formatDate`, `debounce`)
- API constants and helpers

### UI Library (`@monorepo-mixed/ui-lib`)
- Reusable Vue 3 components (`Button`, `Card`, `UserCard`)
- Consistent design system
- TypeScript support with proper exports

### Web App (`@monorepo-mixed/web-app`)
- User management interface
- Uses shared utilities and UI components
- Demonstrates component composition

### Admin App (`@monorepo-mixed/admin-app`)
- Admin dashboard with multiple tabs
- User management with role-based actions
- System settings configuration
- Bundle analysis enabled

## Development

### Install dependencies
```bash
pnpm install
```

### Build shared packages first
```bash
pnpm -r build
```

### Start development servers
```bash
# Start all apps
pnpm dev

# Or start individual apps
cd apps/web-app && pnpm dev     # http://localhost:3000
cd apps/admin-app && pnpm dev   # http://localhost:3001
```

### Build for production
```bash
pnpm build
```

## Key Concepts Demonstrated

1. **Package Dependencies**: Apps depend on shared packages using `workspace:*`
2. **TypeScript Project References**: Proper build order and type checking
3. **Path Aliases**: Clean imports using `@shared/*` and `@ui-lib/*`
4. **Component Reusability**: Same UI components used across different apps
5. **Shared Business Logic**: Common utilities and types prevent duplication
6. **Independent Configuration**: Each app has its own `enhance.config.ts`

## Vite Enhance Kit Features Used

- **Project Detection**: Automatically detects monorepo structure
- **Vue Framework Support**: Automatic Vue plugin configuration
- **Build Caching**: Enabled for faster rebuilds
- **Bundle Analysis**: Enabled for admin app to analyze bundle size
- **TypeScript Support**: Full TypeScript support across all packages