/**
 * Motion's animation features, loaded after first paint.
 *
 * Components render `m.*` elements, which ship without the animation runtime;
 * LazyMotion in App swaps it in once this chunk arrives. domMax rather than
 * domAnimation because the sliding row marker and walkthrough marker use
 * layout animations.
 */
export { domMax as default } from "motion/react";
