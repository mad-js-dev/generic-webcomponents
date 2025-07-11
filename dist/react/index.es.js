import React, { forwardRef, useRef } from "react";
function defineCustomElements() {
  return Promise.all([customElements.whenDefined("collapsible-list"), customElements.whenDefined("collapsible-item"), customElements.whenDefined("icon-label"), customElements.whenDefined("selection-menu"), customElements.whenDefined("image-collection"), customElements.whenDefined("product-layout")]);
}
if (typeof window !== "undefined" && !window.__GENERIC_WEBCOMPONENTS_DEFINED__) {
  window.__GENERIC_WEBCOMPONENTS_DEFINED__ = true;
  defineCustomElements().catch(console.error);
}
defineCustomElements().catch(console.error);
const resolveIconPath = (icon) => {
  if (!icon) return "";
  if (icon.startsWith("http") || icon.startsWith("data:") || icon.startsWith("blob:")) {
    return icon;
  }
  return icon;
};
const createReactWrapper = (tagName) => {
  const Component = forwardRef(({
    children,
    ...props
  }, ref) => {
    const elementRef = useRef(null);
    React.useImperativeHandle(ref, () => elementRef.current);
    const elementProps = Object.entries(props).reduce((acc, [key, value]) => {
      if (key.startsWith("on") && key[2] === key[2].toUpperCase()) {
        const eventName = key[2].toLowerCase() + key.slice(3);
        return {
          ...acc,
          [eventName]: value
        };
      }
      if (key === "className") {
        return {
          ...acc,
          class: value
        };
      }
      if (key === "style" && typeof value === "object") {
        return {
          ...acc,
          style: value
        };
      }
      if (key === "icon") {
        return {
          ...acc,
          icon: resolveIconPath(value)
        };
      }
      return {
        ...acc,
        [key]: value
      };
    }, {});
    const elementPropsWithRef = {
      ...elementProps,
      ref: (element) => {
        if (element) {
          elementRef.current = element;
          if (typeof ref === "function") {
            ref(element);
          } else if (ref) {
            ref.current = element;
          }
        }
      }
    };
    return React.createElement(tagName, elementPropsWithRef, children);
  });
  Component.displayName = tagName;
  return Component;
};
const CollapsibleList = createReactWrapper("collapsible-list");
const CollapsibleItem = createReactWrapper("collapsible-item");
const IconLabel = createReactWrapper("icon-label");
const SelectionMenu = createReactWrapper("selection-menu");
const ImageCollection = createReactWrapper("image-collection");
const ProductLayout = createReactWrapper("product-layout");
const index = {
  CollapsibleList,
  CollapsibleItem,
  IconLabel,
  SelectionMenu,
  ImageCollection,
  ProductLayout,
  defineCustomElements
};
export {
  CollapsibleItem,
  CollapsibleList,
  IconLabel,
  ImageCollection,
  ProductLayout,
  SelectionMenu,
  index as default,
  defineCustomElements
};
//# sourceMappingURL=index.es.js.map
