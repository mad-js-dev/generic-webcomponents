/**
 * Mock data for the collapsible list component
 */

export const mockMenuData = [
  {
    title: 'Item 1',
    reverseHeading: true  // Enable reverse heading for this item and its children
  },
  {
    title: 'Item 2',
    reverseHeading: true,  // Enable reverse heading for this item and its children
    children: [
      { title: 'Subitem 2.1' },
      { title: 'Subitem 2.2' }
    ]
  },
  {
    title: 'Item 3',
    reverseHeading: true ,
    children: [
      { title: 'Subitem 3.1' },
      {
        title: 'Subitem 3.2',
        reverseHeading: true,  // Enable reverse heading for this item and its children
        children: [
          { title: 'Subitem 3.2.1' },
          { title: 'Subitem 3.2.2' }
        ]
      }
    ]
  }
];
