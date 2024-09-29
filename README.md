# @pivanov/deep-clone

A versatile and lightweight deep clone utility for JavaScript and TypeScript.

## Installation

```bash
npm install @pivanov/deep-clone --save-dev
```

or with yarn:

```bash
yarn add @pivanov/deep-clone --dev
```

or with pnpm:

```bash
pnpm add @pivanov/deep-clone --dev
```

## Usage

```typescript
import { deepClone } from '@pivanov/deep-clone';
```
> Note that one of inject or fileName must be provided.

```typescript
const userProfile = {
  name: "Alice",
  contact: {
    email: "alice@example.com",
    phone: { mobile: "123-456", work: "789-101" },
  },
  preferences: new Set(["dark-mode", "notifications"]),
};

const clonedProfile = deepClone(userProfile);

// Modifying the cloned profile won’t affect the original
clonedProfile.contact.phone.mobile = '999-999';
```

## Author

Created by [pivanov](https://github.com/pivanov).

## License

MIT
