import { tick } from "svelte";

import { RouterRegistry } from "../registry.svelte";

/**
 * Options for the route action.
 */
export type RouteOptions = {
  /**
   * When the route is active, these options are applied.
   */
  active?: {
    /**
     * The css class(es) to add when route is active.
     */
    class?: string;
  };
};

/**
 * Svelte action to handle routing with optional active state.
 * Add `use:route` to an anchor element to handle routing and optionally manage active state.
 * @param node - The anchor element to handle.
 * @param options - Options for the route action.
 * @param options.activeClass - The class to add when route is active.
 */
export function route(node: HTMLAnchorElement, { active }: RouteOptions = {}) {
  /**
   * Apply the active class to the node if the current route matches
   * the node's href and the route is not a 404.
   */
  const applyActiveClass = () => {
    if (active?.class) {
      const url = new URL(node.href);
      const route = RouterRegistry.get(url.pathname);
      if (route && route.status !== 404 && route.test(url.pathname)) {
        node.classList.add(active?.class);
      }
    }
  };

  const resetActiveClasses = () => {
    node.classList.remove(active?.class);
  };

  /**
   * Handle click events on the anchor element.
   * @param event - The click event.
   */
  const handleClick = (event: Event) => {
    event.preventDefault();
    window.history.pushState({}, "", node.href);
    tick().then(() => {
      applyActiveClass();
    });
  };

  applyActiveClass();

  node.addEventListener("click", handleClick);

  window.addEventListener("pushState", resetActiveClasses);
  window.addEventListener("replaceState", resetActiveClasses);

  return {
    destroy() {
      node.removeEventListener("click", handleClick);
      window.removeEventListener("pushState", resetActiveClasses);
      window.removeEventListener("replaceState", resetActiveClasses);
    },
  };
}
