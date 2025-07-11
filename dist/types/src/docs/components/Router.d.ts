declare class DocsRouter extends HTMLElement {
    routes: {};
    currentRoute: any;
    connectedCallback(): void;
    disconnectedCallback(): void;
    render(): void;
    setupRouter(): void;
    handlePopState(): void;
    navigate(hash: any): void;
    parseHash(hash: any): any;
}
