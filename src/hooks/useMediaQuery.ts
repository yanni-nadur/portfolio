import { useEffect, useState } from "react";

// -- FUNCTIONS
export function useMediaQuery(queryText: string): boolean
{
    const [matches, setMatches] = useState(() =>
    {
        if (typeof window === "undefined")
        {
            return false;
        }

        return window.matchMedia(queryText).matches;
    });

    useEffect(() =>
    {
        const mediaQueryList = window.matchMedia(queryText);

        function handleChange()
        {
            setMatches(mediaQueryList.matches);
        }

        handleChange();
        mediaQueryList.addEventListener("change", handleChange);

        return () =>
        {
            mediaQueryList.removeEventListener("change", handleChange);
        };
    }, [queryText]);

    return matches;
}

export function useIsDesktop(): boolean
{
    return useMediaQuery("(min-width: 1024px)");
}

export function usePrefersReducedMotion(): boolean
{
    return useMediaQuery("(prefers-reduced-motion: reduce)");
}

export function useIsFinePointer(): boolean
{
    return useMediaQuery("(hover: hover) and (pointer: fine)");
}
