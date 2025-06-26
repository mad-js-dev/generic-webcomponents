/**
 * Mock data for the collapsible list component
 */
export const mockMenuData: ({
    title: string;
    reverseHeading: boolean;
    children?: undefined;
} | {
    title: string;
    reverseHeading: boolean;
    children: ({
        title: string;
        reverseHeading?: undefined;
        children?: undefined;
    } | {
        title: string;
        reverseHeading: boolean;
        children: {
            title: string;
        }[];
    })[];
})[];
