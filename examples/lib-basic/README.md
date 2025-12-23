# Lib Basic Example

This is a basic library example built with Vite Enhance Kit.

## Features

- TypeScript support with declaration files
- ESM module format
- Tree-shakable exports
- Utility functions for common operations

## Usage

```typescript
import { createUser, validateEmail, arrayUtils } from 'lib-basic-example';

// Create a user
const user = createUser({
  name: 'John Doe',
  email: 'john@example.com'
});

// Validate email
const isValid = validateEmail('test@example.com');

// Use array utilities
const unique = arrayUtils.unique([1, 2, 2, 3, 3, 4]);
const grouped = arrayUtils.groupBy(users, user => user.role);
const chunks = arrayUtils.chunk([1, 2, 3, 4, 5], 2);
```

## Build

```bash
pnpm build
```

This will generate:
- `dist/index.js` - ESM bundle
- `dist/index.d.ts` - TypeScript declarations