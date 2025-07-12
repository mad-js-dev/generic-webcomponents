export * from '../../components/templates/product-layout/ProductLayout.js'


declare namespace VuePlugin {
    function install(app: any): void;
}


export namespace Components {
    function load(): Promise<{
        load(): Promise</*elided*/ any>;
    }>;
}

