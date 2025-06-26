export * from './components';
export { default as ReactWrappers } from './wrappers/react/index.jsx';
export { default as VuePlugin } from './wrappers/vue';
export namespace Components {
    function load(): Promise<{
        load(): Promise</*elided*/ any>;
    }>;
}
