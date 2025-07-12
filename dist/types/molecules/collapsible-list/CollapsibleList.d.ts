export * from '../../components/molecules/collapsible-list/CollapsibleList.js'


declare namespace VuePlugin {
    function install(app: any): void;
}


export namespace Components {
    function load(): Promise<{
        load(): Promise</*elided*/ any>;
    }>;
}

