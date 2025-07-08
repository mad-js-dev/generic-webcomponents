// Core web components
export * from './components';

// Additional components that need to be loaded asynchronously
import { loadAdditionalComponents, getAdditionalComponents } from './components';

// Import React wrappers
import ReactWrappers from './wrappers/react/index.jsx';

// Export Vue plugin
export { default as VuePlugin } from './wrappers/vue';

// Export React wrappers as both default and named exports
export const ReactComponents = ReactWrappers;
export default ReactWrappers;

// Export component loader
export const Components = {
  // Core components are already available via default export
  ...getAdditionalComponents(),
  
  // Method to load additional components
  async load() {
    await loadAdditionalComponents();
    Object.assign(this, getAdditionalComponents());
    return this;
  }
};

// Auto-load additional components in browser environment
if (typeof window !== 'undefined') {
  Components.load().catch(console.error);
}

// For better tree-shaking and explicit imports
export * from './components';
