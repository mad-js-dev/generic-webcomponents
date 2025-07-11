export default ProductLayoutPage;
declare class ProductLayoutPage extends HTMLElement {
    images: any[];
    connectedCallback(): Promise<void>;
    render(): Promise<void>;
    initializeDemo(): Promise<void>;
}
