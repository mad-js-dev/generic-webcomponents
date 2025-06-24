import * as webComponents from '../../components';

const VuePlugin = {
  install(app) {
    // Register all web components as Vue components
    Object.entries(webComponents).forEach(([componentName, webComponent]) => {
      if (typeof webComponent === 'function' && webComponent.name) {
        const tagName = webComponent.is || componentName.toLowerCase();
        
        // Create a Vue component definition
        const vueComponent = {
          name: componentName,
          inheritAttrs: false,
          emits: [], // Will be populated with event names
          props: {},
          render() {
            // Convert kebab-case attributes to camelCase for web components
            const attrs = Object.entries(this.$attrs).reduce((acc, [key, value]) => {
              // Convert kebab-case to camelCase for props
              const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
              acc[camelKey] = value;
              return acc;
            }, {});

            // Add event listeners
            const on = {};
            Object.keys(this.$listeners).forEach((event) => {
              on[event] = this.$listeners[event];
            });

            return this.$createElement(
              tagName,
              {
                attrs,
                on,
                ref: 'webComponent',
              },
              this.$slots.default
            );
          },
        };

        // Register the component globally
        app.component(componentName, vueComponent);
      }
    });
  },
};

export default VuePlugin;
