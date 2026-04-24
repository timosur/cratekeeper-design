/**
 * Brand guide loading utilities
 *
 * NOTE: Brand guide functionality has been merged into the design-system.
 * This file is kept for backwards compatibility but should be considered deprecated.
 * Use design-system-loader.ts instead.
 */

// Re-export from design-system-loader for backwards compatibility
export {
  hasDesignResources as hasBrandResources,
  getDesignResourceFiles as getBrandResourceFiles,
} from "./design-system-loader";

/**
 * @deprecated Use loadDesignSystem() from design-system-loader instead
 */
export function loadBrandGuide() {
  return null;
}

/**
 * @deprecated Use hasDesignSystem() from design-system-loader instead
 */
export function hasBrandGuide() {
  return false;
}
