import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode
} from "react";
import { isAppId } from "../system/appRegistry";

// -- TYPES
export type PortfolioView = "landing" | "simple" | "os";

type ViewContextValue = {
    view: PortfolioView;
    openLanding: () => void;
    openSimple: () => void;
    openOs: () => void;
};

// -- CONSTANTS
const ViewContext = createContext<ViewContextValue | null>(null);

// -- FUNCTIONS
export function parsePortfolioView(hashText: string): PortfolioView
{
    const cleanedHash = hashText.replace(/^#\/?/, "").trim();
    const firstSegment = cleanedHash.split("/").filter(Boolean)[0] ?? "";

    if (!firstSegment)
    {
        return "landing";
    }

    if (firstSegment === "simple")
    {
        return "simple";
    }

    if (firstSegment === "os" || isAppId(firstSegment))
    {
        return "os";
    }

    return "landing";
}

function buildViewHash(view: PortfolioView, currentHash: string): string
{
    if (view === "landing")
    {
        return "#/";
    }

    if (view === "simple")
    {
        return "#/simple";
    }

    const cleanedHash = currentHash.replace(/^#\/?/, "").trim();
    const firstSegment = cleanedHash.split("/").filter(Boolean)[0] ?? "";

    if (firstSegment === "os" || isAppId(firstSegment))
    {
        return currentHash.startsWith("#") ? currentHash : `#/${cleanedHash}`;
    }

    return "#/os";
}

// -- OPERATIONS
export function ViewProvider({ children }: { children: ReactNode })
{
    const [view, setView] = useState<PortfolioView>(() =>
    {
        if (typeof window === "undefined")
        {
            return "landing";
        }

        return parsePortfolioView(window.location.hash);
    });

    useEffect(() =>
    {
        function handleHashChange()
        {
            setView(parsePortfolioView(window.location.hash));
        }

        window.addEventListener("hashchange", handleHashChange);
        handleHashChange();

        return () =>
        {
            window.removeEventListener("hashchange", handleHashChange);
        };
    }, []);

    const openLanding = useCallback(() =>
    {
        setView("landing");
        window.history.replaceState(null, "", "#/");
    }, []);

    const openSimple = useCallback(() =>
    {
        setView("simple");
        window.history.replaceState(null, "", "#/simple");
    }, []);

    const openOs = useCallback(() =>
    {
        setView("os");
        const currentView = parsePortfolioView(window.location.hash);

        if (currentView !== "os")
        {
            window.history.replaceState(null, "", "#/os");
        }
    }, []);

    useEffect(() =>
    {
        const nextHash = buildViewHash(view, window.location.hash);

        if (view === "landing" || view === "simple")
        {
            if (window.location.hash !== nextHash)
            {
                window.history.replaceState(null, "", nextHash);
            }
        }
    }, [view]);

    const value = useMemo<ViewContextValue>(() => ({
        view,
        openLanding,
        openSimple,
        openOs
    }), [view, openLanding, openSimple, openOs]);

    return (
        <ViewContext.Provider value={value}>
            {children}
        </ViewContext.Provider>
    );
}

export function useView(): ViewContextValue
{
    const contextValue = useContext(ViewContext);

    if (!contextValue)
    {
        throw new Error("useView must be used within ViewProvider");
    }

    return contextValue;
}
