import { useEffect, useRef, forwardRef } from 'react';
import * as webComponents from '../../components';

// Auto-generate React wrappers for all web components
const wrappers = {};

Object.entries(webComponents).forEach(([componentName, webComponent]) => {
  if (typeof webComponent === 'function' && webComponent.name) {
    const ReactComponent = forwardRef(({ children, ...props }, ref) => {
      const elementRef = useRef(null);
      const eventHandlers = useRef({});

      // Handle event listeners
      useEffect(() => {
        const element = elementRef.current;
        const currentEventHandlers = {};

        // Add event listeners
        Object.entries(props).forEach(([key, value]) => {
          if (typeof value === 'function' && key.startsWith('on')) {
            const eventName = key.substring(2).toLowerCase();
            const handler = (e) => {
              // Forward the event to the React event handler
              value(e);
            };
            element.addEventListener(eventName, handler);
            currentEventHandlers[eventName] = handler;
          }
        });

        // Store current event handlers for cleanup
        eventHandlers.current = currentEventHandlers;

        // Cleanup event listeners
        return () => {
          Object.entries(eventHandlers.current).forEach(([eventName, handler]) => {
            element.removeEventListener(eventName, handler);
          });
        };
      }, [props]);

      // Filter out event handlers from props to avoid React warnings
      const elementProps = Object.entries(props).reduce((acc, [key, value]) => {
        if (!(typeof value === 'function' && key.startsWith('on'))) {
          acc[key] = value;
        }
        return acc;
      }, {});

      // Forward the ref
      useEffect(() => {
        if (ref) {
          if (typeof ref === 'function') {
            ref(elementRef.current);
          } else {
            ref.current = elementRef.current;
          }
        }
      }, [ref]);

      const TagName = webComponent.is || componentName.toLowerCase();
      
      return (
        <TagName ref={elementRef} {...elementProps}>
          {children}
        </TagName>
      );
    });

    // Set display name for better debugging
    ReactComponent.displayName = componentName;
    wrappers[componentName] = ReactComponent;
  }
});

export default wrappers;
