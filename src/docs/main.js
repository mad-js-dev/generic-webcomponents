// Import layout and router components
import './components/Layout.js';
import './components/Router.js';

// Import page components
import './pages/HomePage.js';
import './pages/CollapsibleListPage.js';
import './pages/CollapsibleItemPage.js';
import './pages/SelectionMenuPage.js';
import './pages/ImageCollectionPage.js';
import './pages/ProductLayoutPage';

// Import component definitions
import { CollapsibleList } from '../components/molecules/collapsible-list/CollapsibleList.js';
import { CollapsibleItem } from '../components/atoms/collapsible-item/CollapsibleItem.js';
import { SelectionMenu } from '../components/organisms/selection-menu/SelectionMenu.js';
import { ImageCollection } from '../components/organisms/image-collection/ImageCollection.js';
import { ProductLayout } from '../components/templates/product-layout/ProductLayout.js';

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
