export type CarouselWrapperClasses = {
  wrapper: string;
  content: string;
  item: string;
  next: string;
  prev: string;
  navigation: string;
  viewport: string;
};
export interface CarouselWrapperProps {
  children: React.ReactNode;
  /** Autoplay delay in milliseconds (default: 3000) */
  autoplayDelay?: number;
  /** Enable autoplay (default: true) */
  autoplay?: boolean;
  /**
   * Start autoplay only while hovered.
   *
   * This is primarily useful together with autoplay={false}, where the carousel
   * should remain idle until the user hovers over it.
   */
  playOnHover?: boolean;
  /** Allow free dragging between slides (default: true) */
  dragFree?: boolean;
  /** Stop autoplay when user interacts (default: false) */
  stopOnInteraction?: boolean;
  /** Pause autoplay on mouse hover (default: true) */
  pauseOnHover?: boolean;
  /** Show navigation arrows (default: true) */
  showNavigation?: boolean;
  /** Additional class names for the carousel elements */
  classes?: Partial<CarouselWrapperClasses>;
  /** Enable infinite loop (default: true) */
  loop?: boolean;
  /** Orientation of the carousel (default: horizontal) */
  orientation?: 'horizontal' | 'vertical';
}
