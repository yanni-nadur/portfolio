import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode
} from "react";
import {
    buildViewPath,
    migrateLegacyHashRoute,
    parseViewFromPath,
    replacePath
} from "../system/pathRouting";

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
export function parsePortfolioView(pathOrHashText: string): PortfolioView
{
    if (pathOrHashText.startsWith("#"))
    {
        const cleanedHash = pathOrHashText.replace(/^#\/?/, "").trim();
        const firstSegment = cleanedHash.split("/").filter(Boolean)[0] ?? "";

        if (!firstSegment)
        {
            return "landing";
        }

        if (firstSegment === "simple")
        {
            return "simple";
        }

        if (firstSegment === "os")
        {
            return "os";
        }

        return parseViewFromPath(`/${cleanedHash}`);
    }

    return parseViewFromPath(pathOrHashText);
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

        migrateLegacyHashRoute();
        return parseViewFromPath();
    });

    useEffect(() =>
    {
        function handlePopState()
        {
            setView(parseViewFromPath());
        }

        window.addEventListener("popstate", handlePopState);
        setView(parseViewFromPath());

        return () =>
        {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

    const openLanding = useCallback(() =>
    {
        setView("landing");
        replacePath(buildViewPath("landing"));
    }, []);

    const openSimple = useCallback(() =>
    {
        setView("simple");
        replacePath(buildViewPath("simple"));
    }, []);

    const openOs = useCallback(() =>
    {
        setView("os");
        const currentView = parseViewFromPath();

        if (currentView !== "os")
        {
            replacePath(buildViewPath("os"));
        }
    }, []);

    useEffect(() =>
    {
        if (view === "landing" || view === "simple")
        {
            replacePath(buildViewPath(view));
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
