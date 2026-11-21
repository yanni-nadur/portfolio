import { useLayoutEffect, useState, type RefObject } from "react";

// -- FUNCTIONS
export function useContainerMinWidth(
    containerRef: RefObject<HTMLElement | null>,
    minWidth: number
): boolean
{
    const [matches, setMatches] = useState(() =>
    {
        if (typeof window === "undefined")
        {
            return true;
        }

        return window.innerWidth >= minWidth;
    });

    useLayoutEffect(() =>
    {
        const container = containerRef.current;

        if (!container)
        {
            return;
        }

        function updateMatch(width: number)
        {
            setMatches(width >= minWidth);
        }

        updateMatch(container.clientWidth);

        if (typeof ResizeObserver === "undefined")
        {
            function handleResize()
            {
                if (containerRef.current)
                {
                    updateMatch(containerRef.current.clientWidth);
                }
            }

            window.addEventListener("resize", handleResize);

            return () =>
            {
                window.removeEventListener("resize", handleResize);
            };
        }

        const resizeObserver = new ResizeObserver((entryArray) =>
        {
            const entry = entryArray[0];

            if (!entry)
            {
                return;
            }

            updateMatch(entry.contentRect.width);
        });

        resizeObserver.observe(container);

        return () =>
        {
            resizeObserver.disconnect();
        };
    }, [containerRef, minWidth]);

    return matches;
}
