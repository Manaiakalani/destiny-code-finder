import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

const RELOAD_FLAG = "route-chunk-reloaded";

/**
 * Catches lazy-route chunk failures. GitHub Pages caches index.html for ten
 * minutes while Vite emits content-hashed chunks, so a client holding a stale
 * index.html after a deploy can request a chunk that no longer exists. Without
 * this boundary that rejection unmounts the whole tree and blanks the page.
 */
export class RouteErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch() {
    // A stale chunk resolves itself on reload, so try exactly once per session
    // to avoid a reload loop when the failure is not deploy-related.
    try {
      if (sessionStorage.getItem(RELOAD_FLAG) === null) {
        sessionStorage.setItem(RELOAD_FLAG, "1");
        window.location.reload();
      }
    } catch {
      // sessionStorage unavailable — fall through to the manual affordance.
    }
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="font-heading text-2xl font-bold mb-3">This page failed to load</h1>
          <p className="text-muted-foreground mb-6">
            The site was likely updated while this tab was open. Reloading should fix it.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center h-11 min-h-[44px] rounded-md px-8 btn-solar text-solar-foreground font-heading tracking-wider"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}
