# Generic Web Components

A collection of reusable web components that work seamlessly across different frameworks including React and Vue.

## Features

- Framework-agnostic web components
- Built with modern Web Components standards
- TypeScript support
- Lightweight and dependency-free
- Simple and intuitive API
- First-class support for React and Vue

## Installation

### Core Package

```bash
npm install @mad-js-dev/generic-webcomponents
```

### Peer Dependencies

For React:
```bash
npm install react react-dom
```

For Vue 3:
```bash
npm install vue@^3.0.0
```

## Usage

### Vanilla JavaScript/HTML

```html
<script type="module">
  import '@mad-js-dev/generic-webcomponents';
</script>

<collapsible-list>
  <collapsible-item>Item 1</collapsible-item>
  <collapsible-item>
    Parent Item
    <collapsible-list>
      <collapsible-item>Child 1</collapsible-item>
      <collapsible-item>Child 2</collapsible-item>
    </collapsible-list>
  </collapsible-item>
  <collapsible-item>Item 3</collapsible-item>
</collapsible-list>
```

### React

#### Option 1: Using React Components (Recommended)

```jsx
import { CollapsibleList, CollapsibleItem } from '@mad-js-dev/generic-webcomponents/react';

function App() {
  return (
    <CollapsibleList>
      <CollapsibleItem>Item 1</CollapsibleItem>
      <CollapsibleItem>
        Parent Item
        <CollapsibleList>
          <CollapsibleItem>Child 1</CollapsibleItem>
          <CollapsibleItem>Child 2</CollapsibleItem>
        </CollapsibleList>
      </CollapsibleItem>
      <CollapsibleItem>Item 3</CollapsibleItem>
    </CollapsibleList>
  );
}

export default App;
```

#### Option 2: Using Web Components Directly

```jsx
import { useEffect, useRef } from 'react';
import '@mad-js-dev/generic-webcomponents';

function App() {
  return (
    <collapsible-list>
      <collapsible-item>Item 1</collapsible-item>
      <collapsible-item>
        Parent Item
        <collapsible-list>
          <collapsible-item>Child 1</collapsible-item>
          <collapsible-item>Child 2</collapsible-item>
        </collapsible-list>
      </collapsible-item>
      <collapsible-item>Item 3</collapsible-item>
    </collapsible-list>
  );
}

export default App;
```

### Vue 3

#### Option 1: Using Vue Plugin (Recommended)

In your main application file:

```js
import { createApp } from 'vue';
import App from './App.vue';
import { VuePlugin } from '@mad-js-dev/generic-webcomponents/vue';

const app = createApp(App);
app.use(VuePlugin);
app.mount('#app');
```

Then in your components:

```vue
<template>
  <collapsible-list>
    <collapsible-item>Item 1</collapsible-item>
    <collapsible-item>
      Parent Item
      <collapsible-list>
        <collapsible-item>Child 1</collapsible-item>
        <collapsible-item>Child 2</collapsible-item>
      </collapsible-list>
    </collapsible-item>
    <collapsible-item>Item 3</collapsible-item>
  </collapsible-list>
</template>

<script>
export default {
  name: 'MyComponent'
}
</script>
```

#### Option 2: Using Web Components Directly

```vue
<template>
  <collapsible-list>
    <collapsible-item>Item 1</collapsible-item>
    <collapsible-item>
      Parent Item
      <collapsible-list>
        <collapsible-item>Child 1</collapsible-item>
        <collapsible-item>Child 2</collapsible-item>
      </collapsible-list>
    </collapsible-item>
    <collapsible-item>Item 3</collapsible-item>
  </collapsible-list>
</template>

<script>
import '@mad-js-dev/generic-webcomponents';

export default {
  name: 'MyComponent'
}
</script>
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Building for Production

```bash
# Build the library
npm run build

# This will create:
# - dist/index.es.js    (ES module version)
# - dist/index.umd.js   (UMD version)
# - dist/*.d.ts         (TypeScript type definitions)
```

## Publishing to NPM

1. Update the `version` in `package.json`
2. Update the `name` in `package.json` to your package name
3. Login to npm: `npm login`
4. Publish: `npm publish --access public`

## TypeScript Support

TypeScript type definitions are included in the package. No additional configuration is needed.

```javascript
import './node_modules/collapsible-list/dist/collapsible-list.js';
```

## API

### CollapsibleList
Extends `HTMLUListElement`

### CollapsibleItem
Extends `HTMLLIElement`

#### Properties
- `isExpanded` (readonly): Returns `true` if the item is expanded

#### Methods
- `toggle()`: Toggles the expanded/collapsed state
- `expand()`: Expands the item
- `collapse()`: Collapses the item

#### Events
- `expanded`: Fired when the item is expanded
- `collapsed`: Fired when the item is collapsed

## Browser Support

All modern browsers that support Web Components (Chrome, Firefox, Safari, Edge)

## License

MIT
