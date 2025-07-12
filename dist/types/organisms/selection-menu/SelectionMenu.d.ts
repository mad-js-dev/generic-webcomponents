export * from '../../components/organisms/selection-menu/SelectionMenu.js'


declare namespace VuePlugin {
    function install(app: any): void;
}


export namespace Components {
    function load(): Promise<{
        load(): Promise</*elided*/ any>;
    }>;
}

