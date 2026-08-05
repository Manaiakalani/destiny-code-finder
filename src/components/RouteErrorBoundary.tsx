import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  isChunkError: boolean;
}

const RELOAD_FLAG = "route-chunk-reloaded-at";
// Long enough that a genuinely broken build cannot reload-loop, short enough
// that a second deploy later in the same tab can still self-heal.
const RELOAD_COOLDOWN_MS = 60_000;

const CHUNK_ERROR_PATTERN =
  /failed to fetch dynamically imported module|error loading dynamically imported module|importing a module script failed|chunkloaderror|loading chunk \S+ failed|dynamically imported module/i;

function isChunkLoadError(error: unknown): boolean {
  if (!error) return false;

  const description = error instanceof Error
    ? `${error.name} ${error.message}`
    : String(error);

  return CHUNK_ERROR_PATTERN.test(description);
}

/**
 * Catches lazy-route chunk failures. GitHub Pages caches index.html for ten
 * minutes while Vite emits content-hashed chunks, so a client holding a stale
 * index.html after a deploy can request a chunk that no longer exists. Without
 * this boundary that rejection unmounts the whole tree and blanks the page.
 */
export class RouteErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, isChunkError: false };

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, isChunkError: isChunkLoadError(error) };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Route render failed:", error, errorInfo);

    // Only a stale chunk resolves itself on reload. Reloading on an ordinary
    // render error just hides the failure and costs the user a round trip.
    if (!isChunkLoadError(error)) {
      return;
    }

    try {
      const lastReload = Number(sessionStorage.getItem(RELOAD_FLAG));
      const isCoolingDown =
        Number.isFinite(lastReload) &&
        lastReload > 0 &&
        Date.now() - lastReload < RELOAD_COOLDOWN_MS;

      if (!isCoolingDown) {
        sessionStorage.setItem(RELOAD_FLAG, String(Date.now()));
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
            {this.state.isChunkError
              ? "The site was likely updated while this tab was open. Reloading should fix it."
              : "Something went wrong rendering this page. Reloading may help."}
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
