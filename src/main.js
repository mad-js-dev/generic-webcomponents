// Import layout and router components
import './docs/components/Layout.js';
import './docs/components/Router.js';

// Import page components
import './docs/pages/HomePage.js';
import './docs/pages/CollapsibleListPage.js';
import './docs/pages/CollapsibleItemPage.js';
import './docs/pages/SelectionMenuPage.js';
import './docs/pages/ImageCollectionPage.js';
import './docs/pages/ProductLayoutPage';
import './docs/pages/IconLabelPage';

// Import component definitions
import { CollapsibleList } from './components/molecules/collapsible-list/CollapsibleList.js';
import { CollapsibleItem } from './components/molecules/collapsible-item/CollapsibleItem.js';
import { SelectionMenu } from './components/organisms/selection-menu/SelectionMenu.js';
import { ImageCollection } from './components/organisms/image-collection/ImageCollection.js';
import { ProductLayout } from './components/templates/product-layout/ProductLayout.js';
import { IconLabel } from './components/atoms/icon-label/IconLabel';

// Define custom elements if they haven't been defined yet
if (!customElements.get('collapsible-list')) {
  customElements.define('collapsible-list', CollapsibleList);
}
if (!customElements.get('collapsible-item')) {
  customElements.define('collapsible-item', CollapsibleItem);
}
if (!customElements.get('selection-menu')) {
  customElements.define('selection-menu', SelectionMenu);
}
if (!customElements.get('image-collection')) {
  customElements.define('image-collection', ImageCollection);
}
if (!customElements.get('product-layout')) {
  customElements.define('product-layout', ProductLayout);
}
if (!customElements.get('icon-label')) {
  customElements.define('icon-label', IconLabel);
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    if (!app) return;

    // Set up the app with layout and router
    app.innerHTML = `
        <docs-layout>
            <docs-router>
                <home-page path="/"></home-page>
                <collapsible-list-page path="/collapsible-list"></collapsible-list-page>
                <collapsible-item-page path="/collapsible-item"></collapsible-item-page>
                <icon-label-page path="/icon-label"></icon-label-page>
                <selection-menu-page path="/selection-menu"></selection-menu-page>
                <image-collection-page path="/image-collection"></image-collection-page>
                <product-layout-page path="/product-layout"></product-layout-page>
            </docs-router>
        </docs-layout>
    `;

    // Set active nav link based on current route
    function updateActiveLink() {
        const path = window.location.hash.replace(/^#\/?/, '/') || '/';
        const links = document.querySelectorAll('docs-layout .nav-link');
        links.forEach(link => {
            const linkPath = link.getAttribute('href').replace(/^#/, '');
            if ((path === '/' && linkPath === '/') || 
                (path !== '/' && linkPath.includes(path))) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Update active link on route change
    window.addEventListener('popstate', updateActiveLink);
    updateActiveLink();
});
