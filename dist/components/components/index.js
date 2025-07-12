import { CollapsibleList as d } from "./molecules/collapsible-list/CollapsibleList.js";
import { CollapsibleItem as r } from "./molecules/collapsible-item/CollapsibleItem.js";
let t = {};
async function n() {
  try {
    const o = await import("./organisms/selection-menu/SelectionMenu.js");
    t.SelectionMenu = o.default || o;
  } catch (o) {
    console.warn("SelectionMenu component not found or failed to load", o);
  }
  try {
    const o = await import("./templates/product-layout/ProductLayout.js");
    t.ProductLayout = o.default || o;
  } catch (o) {
    console.warn("ProductLayout component not found or failed to load", o);
  }
  return t;
}
function e() {
  return t;
}
export {
  r as CollapsibleItem,
  d as CollapsibleList,
  e as getAdditionalComponents,
  n as loadAdditionalComponents
};
//# sourceMappingURL=index.js.map
