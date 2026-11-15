import { useEffect, type RefObject } from "react";

// -- CONSTANTS
const FOCUSABLE_SELECTOR = [
    "a[href]",
    "button:not([disabled])",
    "textarea:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "[tabindex]:not([tabindex='-1'])"
].join(",");

// -- FUNCTIONS
export function useFocusTrap(
    containerRef: RefObject<HTMLElement | null>,
    isActive: boolean
): void
{
    useEffect(() =>
    {
        if (!isActive || !containerRef.current)
        {
            return;
        }

        const containerElement = containerRef.current;
        const previouslyFocusedElement = document.activeElement as HTMLElement | null;
        const focusableElementArray = Array.from(
            containerElement.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        );

        const firstElement = focusableElementArray[0] ?? containerElement;
        firstElement.focus();

        function handleKeyDown(event: KeyboardEvent)
        {
            if (event.key !== "Tab")
            {
                return;
            }

            const liveFocusableArray = Array.from(
                containerElement.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
            );

            if (liveFocusableArray.length === 0)
            {
                event.preventDefault();
                containerElement.focus();
                return;
            }

            const firstFocusable = liveFocusableArray[0];
            const lastFocusable = liveFocusableArray[liveFocusableArray.length - 1];

            if (event.shiftKey && document.activeElement === firstFocusable)
            {
                event.preventDefault();
                lastFocusable.focus();
            }
            else if (!event.shiftKey && document.activeElement === lastFocusable)
            {
                event.preventDefault();
                firstFocusable.focus();
            }
        }

        containerElement.addEventListener("keydown", handleKeyDown);

        return () =>
        {
            containerElement.removeEventListener("keydown", handleKeyDown);
            previouslyFocusedElement?.focus();
        };
    }, [containerRef, isActive]);
}
