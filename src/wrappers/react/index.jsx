/// src/wrappers/react/index.jsx
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { defineCustomElements } from '../../init.js';

// Initialize web components when the module is loaded
defineCustomElements().catch(console.error);

// Handle icon path resolution for React
const resolveIconPath = (icon) => {
  if (!icon) return '';
  // If it's a full URL or data URI, use as is
  if (icon.startsWith('http') || icon.startsWith('data:') || icon.startsWith('blob:')) {
    return icon;
  }
  // For local paths, assume they're relative to the public folder in the consuming app
  return icon;
};

// Create React wrappers for each web component
const createReactWrapper = (tagName) => {
  const Component = forwardRef(({ 
    children, 
    style, 
    className, 
    onToggle, // Special handler for collapsible-item
    ...props 
  }, ref) => {
    const elementRef = useRef(null);
    
    // Handle ref forwarding
    useImperativeHandle(ref, () => ({
      ...(elementRef.current || {}),
      // Add any component-specific methods here
    }));

    // Handle custom element ref
    const handleRef = (el) => {
      elementRef.current = el;
      
      // Forward the ref
      if (ref) {
        if (typeof ref === 'function') {
          ref(el);
        } else if (ref) {
          ref.current = el;
        }
      }
      
      // Add event listeners for collapsible-item
      if (tagName === 'collapsible-item' && el) {
        el.addEventListener('toggle', (e) => {
          if (onToggle) onToggle(e);
        });
      }
    };
    
    // Special handling for specific components
    if (tagName === 'icon-label') {
      return React.createElement(tagName, {
        ref: handleRef,
        ...props,
        class: className,
        style: {
          '--icon-size': '24px', // Default size, can be overridden by style prop
          ...(style || {})
        },
        'icon': props.icon ? resolveIconPath(props.icon) : undefined,
        'label': props.label || ''
      }, children);
    }
    
    // Special handling for collapsible-item
    if (tagName === 'collapsible-item') {
      const { expanded, icon, label, removeshift, hideIcon, ...restProps } = props;
      
      return React.createElement(tagName, {
        ref: handleRef,
        ...restProps,
        class: className,
        style: style,
        'expanded': expanded,
        'icon': icon,
        'label': label,
        'removeshift': removeshift,
        'hide-icon': hideIcon
      }, children);
    }
    
    // For other components
    const elementProps = Object.entries(props).reduce((acc, [key, value]) => {
      // Handle events (onEvent -> onevent)
      if (key.startsWith('on') && key[2] === key[2].toUpperCase()) {
        const eventName = key[2].toLowerCase() + key.slice(3);
        return { ...acc, [eventName]: value };
      }
      // Handle className -> class
      if (key === 'className') {
        return { ...acc, class: value };
      }
      // Handle style object
      if (key === 'style' && typeof value === 'object') {
        return { ...acc, style: value };
      }
      // Special handling for icon prop
      if (key === 'icon') {
        return { ...acc, icon: resolveIconPath(value) };
      }
      // Pass through other props
      return { ...acc, [key]: value };
    }, {});
    
    // Handle ref and props
    const elementPropsWithRef = {
      ...elementProps,
      ref: (element) => {
        if (element) {
          elementRef.current = element;
          
          // Forward the ref if it's a function
          if (typeof ref === 'function') {
            ref(element);
          } else if (ref) {
            ref.current = element;
          }
        }
      }
    };
    
    return React.createElement(tagName, elementPropsWithRef, children);
  });
  
  // Set display name for better debugging
  Component.displayName = tagName;
  
  return Component;
};

// Export all components as named exports
const CollapsibleList = createReactWrapper('collapsible-list');
const CollapsibleItem = createReactWrapper('collapsible-item');
const IconLabel = createReactWrapper('icon-label');
const SelectionMenu = createReactWrapper('selection-menu');
const ImageCollection = createReactWrapper('image-collection');
const ProductLayout = createReactWrapper('product-layout');

// Export all components as named exports
export {
  CollapsibleList,
  CollapsibleItem,
  IconLabel,
  SelectionMenu,
  ImageCollection,
  ProductLayout,
  defineCustomElements
};

// Default export with all components
export default {
  CollapsibleList,
  CollapsibleItem,
  IconLabel,
  SelectionMenu,
  ImageCollection,
  ProductLayout,
  defineCustomElements
};