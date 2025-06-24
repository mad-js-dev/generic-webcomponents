# Generic Web Components

A collection of reusable web components that work seamlessly across different frameworks including React and Vue.

## Features

- Framework-agnostic web components
- Built with modern Web Components standards
- TypeScript support
- Lightweight and dependency-free
- Simple and intuitive API
- Works with React and Vue out of the box

## Installation

```bash
# Install the package
npm install your-package-name
```

## Usage

### Vanilla JavaScript/HTML

```html
<script type="module">
  import 'your-package-name';
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

First, install the required peer dependencies:

```bash
npm install react react-dom
```

Then use the React wrappers in your components:

```jsx
import React from 'react';
import { ReactWrappers } from 'your-package-name';

const { CollapsibleList, CollapsibleItem } = ReactWrappers;

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

### Vue 3

First, install the required peer dependencies:

```bash
npm install vue@next
```

Then install the plugin in your main application file:

```js
import { createApp } from 'vue';
import App from './App.vue';
import { VuePlugin } from 'your-package-name';

const app = createApp(App);
app.use(VuePlugin);
app.mount('#app');
```

Now you can use the components in your Vue templates:

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
