export default class SelectionMenuPage extends HTMLElement {
    _menuData: ({
        id: string;
        name: string;
        children: ({
            id: string;
            name: string;
            children: {
                id: string;
                name: string;
            }[];
        } | {
            id: string;
            name: string;
            children?: undefined;
        })[];
    } | {
        id: string;
        name: string;
        children?: undefined;
    })[];
    connectedCallback(): void;
    createElement(tag: any, attributes?: {}): any;
    createTable(headers: any, rows: any): any;
    setupEventListeners(): void;
    render(): void;
}
