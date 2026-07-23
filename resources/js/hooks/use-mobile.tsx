import { useSyncExternalStore } from 'react';

const MOBILE_BREAKPOINT = 768;

const mql =
    typeof window === 'undefined'
        ? undefined
        : window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

function mediaQueryListener(callback: (event: MediaQueryListEvent) => void) {
    if (!mql) {
        return () => {};
    }

    mql.addEventListener('change', callback);

    return () => {
        mql.removeEventListener('change', callback);
    };
}

function isSmallerThanBreakpoint(): boolean {
    return mql?.matches ?? false;
}

export function useIsMobile(): boolean {
    // Both snapshots read the same live media query — there's no true
    // server render here, and hardcoding a "server" default of `false`
    // caused a mismatch (and the resulting error) for anyone actually on
    // a narrow viewport on first render.
    return useSyncExternalStore(
        mediaQueryListener,
        isSmallerThanBreakpoint,
        isSmallerThanBreakpoint,
    );
}
