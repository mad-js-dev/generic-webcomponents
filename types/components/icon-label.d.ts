// Type definitions for @your-org/icon-label

declare namespace JSX {
  interface IntrinsicElements {
    'icon-label': IconLabelProps;
  }
}

interface IconLabelProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  /**
   * The URL of the icon image to display
   */
  icon?: string;
  
  /**
   * The text label to display next to the icon
   */
  label?: string;
  
  /**
   * If true, places the icon after the text instead of before
   * @default false
   */
  reverse?: boolean;
  
  /**
   * Additional CSS class names
   */
  class?: string;
  
  /**
   * Inline styles
   */
  style?: React.CSSProperties;
  
  /**
   * Event handler for the click event
   */
  onClick?: (event: MouseEvent) => void;
}

/**
 * A web component that displays an icon with a label
 * 
 * @element icon-label
 * 
 * @slot - The label content (alternative to using the 'label' attribute)
 * @slot icon - Custom icon content (alternative to using the 'icon' attribute)
 * 
 * @csspart container - The container element
 * @csspart icon - The icon container
 * @csspart label - The label container
 */
declare class IconLabel extends HTMLElement {
  /**
   * The URL of the icon image to display
   */
  icon: string;
  
  /**
   * The text label to display next to the icon
   */
  label: string;
  
  /**
   * If true, places the icon after the text instead of before
   */
  reverse: boolean;
  
  /**
   * Toggles the reverse layout
   */
  toggleReverse(): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'icon-label': IconLabel;
  }
  
  namespace JSX {
    interface IntrinsicElements {
      'icon-label': Partial<IconLabel>;
    }
  }
}

export {};
