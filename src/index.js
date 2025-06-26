// Core web components
export * from './components';

// Additional components that need to be loaded asynchronously
import { loadAdditionalComponents, getAdditionalComponents } from './components';

// Export React wrappers
export { default as ReactWrappers } from './wrappers/react/index.jsx';

// Export Vue plugin
export { default as VuePlugin } from './wrappers/vue';

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
