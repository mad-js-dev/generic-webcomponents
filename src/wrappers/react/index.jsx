import { useEffect, useRef, forwardRef, useMemo } from 'react';
import * as webComponents from '../../components';

/**
 * Creates a React wrapper for a web component
 * @param {string} componentName - The name of the component
 * @param {Function} webComponent - The web component constructor
 * @returns {Function} React component
 */
const createReactWrapper = (componentName, webComponent) => {
  const ReactComponent = forwardRef(({ children, ...props }, ref) => {
    const elementRef = useRef(null);
    const eventHandlers = useRef({});
    const tagName = webComponent.is || componentName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

    // Memoize props to prevent unnecessary effect runs
    const { elementProps, eventListeners } = useMemo(() => {
      const elementProps = {};
      const eventListeners = {};

      Object.entries(props).forEach(([key, value]) => {
        if (typeof value === 'function' && key.startsWith('on')) {
          const eventName = key.substring(2).toLowerCase();
          eventListeners[eventName] = value;
        } else if (key !== 'children') {
          elementProps[key] = value;
        }
      });

      return { elementProps, eventListeners };
    }, [props]);

    // Handle event listeners
    useEffect(() => {
      const element = elementRef.current;
      if (!element) return;

      const currentHandlers = {};

      // Add new event listeners
      Object.entries(eventListeners).forEach(([eventName, handler]) => {
        const wrappedHandler = (event) => {
          // Create a synthetic event-like object for better React compatibility
          const syntheticEvent = {
            ...event,
            nativeEvent: event,
            currentTarget: element,
            target: event.target,
            preventDefault() {
              event.preventDefault();
            },
            stopPropagation() {
              event.stopPropagation();
            },
          };

          handler(syntheticEvent);
        };

        element.addEventListener(eventName, wrappedHandler);
        currentHandlers[eventName] = wrappedHandler;
      });

      // Store current handlers for cleanup
      const previousHandlers = eventHandlers.current;
      eventHandlers.current = currentHandlers;

      // Cleanup function
      return () => {
        // Remove only the handlers that are no longer needed
        Object.entries(previousHandlers).forEach(([eventName, handler]) => {
          if (currentHandlers[eventName] !== handler) {
            element.removeEventListener(eventName, handler);
          }
        });
      };
    }, [eventListeners]);

    // Handle ref forwarding
    useEffect(() => {
      if (!ref) return;
      
      if (typeof ref === 'function') {
        ref(elementRef.current);
      } else if (ref && typeof ref === 'object') {
        ref.current = elementRef.current;
      }
    }, [ref]);

    // Handle boolean attributes
    const processedProps = useMemo(() => {
      const result = { ...elementProps };
      
      // Convert boolean values to empty strings for web component boolean attributes
      Object.keys(result).forEach(key => {
        if (result[key] === true) {
          result[key] = ''; // Empty string makes the attribute present without a value
        } else if (result[key] === false || result[key] === null || result[key] === undefined) {
          delete result[key]; // Remove falsy values to unset the attribute
        }
      });
      
      return result;
    }, [elementProps]);

    try {
      return (
        <tag-name is={tagName} ref={elementRef} {...processedProps}>
          {children}
        </tag-name>
      );
    } catch (error) {
      console.error(`Error rendering ${componentName}:`, error);
      return null;
    }
  });

  // Set display name for better debugging
  ReactComponent.displayName = componentName;
  
  // Add a reference to the original web component
  ReactComponent.webComponent = webComponent;
  
  return ReactComponent;
};

// Auto-generate React wrappers for all web components
const wrappers = {};

Object.entries(webComponents).forEach(([componentName, webComponent]) => {
  if (typeof webComponent === 'function' && webComponent.name) {
    try {
      wrappers[componentName] = createReactWrapper(componentName, webComponent);
    } catch (error) {
      console.error(`Failed to create React wrapper for ${componentName}:`, error);
    }
  }
});

// Export individual components for better tree-shaking
const {
  IconLabel,
  CollapsibleItem,
  CollapsibleList,
  ImageCollection,
  SelectionMenu,
  ProductLayout,
  ...restComponents
} = wrappers;

// Export all components as named exports
export { 
  IconLabel,
  CollapsibleItem,
  CollapsibleList,
  ImageCollection,
  SelectionMenu,
  ProductLayout 
};

// Export all components as default
export default wrappers;
