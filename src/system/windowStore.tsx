import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useReducer,
    type ReactNode
} from "react";
import { appIdArray, appRegistry, isAppId, type AppId } from "./appRegistry";

// -- TYPES
export type WindowState = {
    id: AppId;
    isOpen: boolean;
    isMinimized: boolean;
    zIndex: number;
    position: { x: number; y: number };
    size: { width: number; height: number };
    route: string | null;
};

type WindowAction =
    | { type: "open"; appId: AppId; route?: string | null }
    | { type: "close"; appId: AppId }
    | { type: "minimize"; appId: AppId }
    | { type: "focus"; appId: AppId }
    | { type: "move"; appId: AppId; position: { x: number; y: number } }
    | { type: "resize"; appId: AppId; size: { width: number; height: number } }
    | { type: "setRoute"; appId: AppId; route: string | null }
    | { type: "syncFromHash"; hashText: string };

type WindowContextValue = {
    windowByIdMap: Record<AppId, WindowState>;
    focusedAppId: AppId | null;
    openApp: (appId: AppId, route?: string | null) => void;
    closeApp: (appId: AppId) => void;
    minimizeApp: (appId: AppId) => void;
    focusApp: (appId: AppId) => void;
    moveWindow: (appId: AppId, position: { x: number; y: number }) => void;
    resizeWindow: (appId: AppId, size: { width: number; height: number }) => void;
    setAppRoute: (appId: AppId, route: string | null) => void;
};

// -- CONSTANTS
const BASE_Z_INDEX = 20;
const WindowContext = createContext<WindowContextValue | null>(null);

// -- FUNCTIONS
function createInitialWindow(appId: AppId, cascadeIndex: number): WindowState
{
    const definition = appRegistry[appId];
    const offset = cascadeIndex * 28;

    return {
        id: appId,
        isOpen: false,
        isMinimized: false,
        zIndex: BASE_Z_INDEX + cascadeIndex,
        position: { x: 72 + offset, y: 64 + offset },
        size: { ...definition.defaultSize },
        route: null
    };
}

function createInitialWindowMap(): Record<AppId, WindowState>
{
    const windowByIdMap = {} as Record<AppId, WindowState>;

    appIdArray.forEach((appId, index) =>
    {
        windowByIdMap[appId] = createInitialWindow(appId, index);
    });

    return windowByIdMap;
}

function getNextZIndex(windowByIdMap: Record<AppId, WindowState>): number
{
    let highestZIndex = BASE_Z_INDEX;

    appIdArray.forEach((appId) =>
    {
        highestZIndex = Math.max(highestZIndex, windowByIdMap[appId].zIndex);
    });

    return highestZIndex + 1;
}

function getFocusedAppId(windowByIdMap: Record<AppId, WindowState>): AppId | null
{
    let focusedAppId: AppId | null = null;
    let highestZIndex = -1;

    appIdArray.forEach((appId) =>
    {
        const windowState = windowByIdMap[appId];

        if (windowState.isOpen && !windowState.isMinimized && windowState.zIndex > highestZIndex)
        {
            highestZIndex = windowState.zIndex;
            focusedAppId = appId;
        }
    });

    return focusedAppId;
}

function parseHash(hashText: string): { appId: AppId | null; route: string | null }
{
    const cleanedHash = hashText.replace(/^#\/?/, "").trim();

    if (!cleanedHash || cleanedHash === "os")
    {
        return { appId: null, route: null };
    }

    const segmentArray = cleanedHash.split("/").filter(Boolean);
    let appSegment = segmentArray[0] ?? "";
    let routeSegmentArray = segmentArray.slice(1);

    if (appSegment === "os")
    {
        appSegment = routeSegmentArray[0] ?? "";
        routeSegmentArray = routeSegmentArray.slice(1);
    }

    if (!isAppId(appSegment))
    {
        return { appId: null, route: null };
    }

    const route = routeSegmentArray.join("/") || null;
    return { appId: appSegment, route };
}

function buildHash(appId: AppId | null, route: string | null): string
{
    if (!appId)
    {
        return "#/os";
    }

    if (!route)
    {
        return `#/${appId}`;
    }

    return `#/${appId}/${route}`;
}

function windowReducer(
    state: Record<AppId, WindowState>,
    action: WindowAction
): Record<AppId, WindowState>
{
    switch (action.type)
    {
        case "open":
        {
            const currentWindow = state[action.appId];

            return {
                ...state,
                [action.appId]: {
                    ...currentWindow,
                    isOpen: true,
                    isMinimized: false,
                    zIndex: getNextZIndex(state),
                    route: action.route !== undefined ? action.route : currentWindow.route
                }
            };
        }
        case "close":
            return {
                ...state,
                [action.appId]: {
                    ...state[action.appId],
                    isOpen: false,
                    isMinimized: false,
                    route: null
                }
            };
        case "minimize":
            return {
                ...state,
                [action.appId]: {
                    ...state[action.appId],
                    isMinimized: true
                }
            };
        case "focus":
            return {
                ...state,
                [action.appId]: {
                    ...state[action.appId],
                    isOpen: true,
                    isMinimized: false,
                    zIndex: getNextZIndex(state)
                }
            };
        case "move":
            return {
                ...state,
                [action.appId]: {
                    ...state[action.appId],
                    position: action.position
                }
            };
        case "resize":
            return {
                ...state,
                [action.appId]: {
                    ...state[action.appId],
                    size: action.size
                }
            };
        case "setRoute":
            return {
                ...state,
                [action.appId]: {
                    ...state[action.appId],
                    route: action.route
                }
            };
        case "syncFromHash":
        {
            const parsedHash = parseHash(action.hashText);

            if (!parsedHash.appId)
            {
                return state;
            }

            const currentWindow = state[parsedHash.appId];

            return {
                ...state,
                [parsedHash.appId]: {
                    ...currentWindow,
                    isOpen: true,
                    isMinimized: false,
                    zIndex: getNextZIndex(state),
                    route: parsedHash.route
                }
            };
        }
        default:
            return state;
    }
}

// -- OPERATIONS
export function WindowProvider({
    children,
    hashSyncEnabled = true
}: {
    children: ReactNode;
    hashSyncEnabled?: boolean;
})
{
    const [windowByIdMap, dispatch] = useReducer(windowReducer, undefined, createInitialWindowMap);
    const focusedAppId = useMemo(() => getFocusedAppId(windowByIdMap), [windowByIdMap]);

    useEffect(() =>
    {
        if (!hashSyncEnabled)
        {
            return;
        }

        function handleHashChange()
        {
            dispatch({ type: "syncFromHash", hashText: window.location.hash });
        }

        handleHashChange();
        window.addEventListener("hashchange", handleHashChange);

        return () =>
        {
            window.removeEventListener("hashchange", handleHashChange);
        };
    }, [hashSyncEnabled]);

    useEffect(() =>
    {
        if (!hashSyncEnabled)
        {
            return;
        }

        const nextHash = buildHash(
            focusedAppId,
            focusedAppId ? windowByIdMap[focusedAppId].route : null
        );

        if (window.location.hash !== nextHash)
        {
            window.history.replaceState(null, "", nextHash);
        }
    }, [focusedAppId, hashSyncEnabled, windowByIdMap]);

    const openApp = useCallback((appId: AppId, route: string | null = null) =>
    {
        dispatch({ type: "open", appId, route });
    }, []);

    const closeApp = useCallback((appId: AppId) =>
    {
        dispatch({ type: "close", appId });
    }, []);

    const minimizeApp = useCallback((appId: AppId) =>
    {
        dispatch({ type: "minimize", appId });
    }, []);

    const focusApp = useCallback((appId: AppId) =>
    {
        dispatch({ type: "focus", appId });
    }, []);

    const moveWindow = useCallback((appId: AppId, position: { x: number; y: number }) =>
    {
        dispatch({ type: "move", appId, position });
    }, []);

    const resizeWindow = useCallback((appId: AppId, size: { width: number; height: number }) =>
    {
        dispatch({ type: "resize", appId, size });
    }, []);

    const setAppRoute = useCallback((appId: AppId, route: string | null) =>
    {
        dispatch({ type: "setRoute", appId, route });
    }, []);

    const value = useMemo<WindowContextValue>(() => ({
        windowByIdMap,
        focusedAppId,
        openApp,
        closeApp,
        minimizeApp,
        focusApp,
        moveWindow,
        resizeWindow,
        setAppRoute
    }), [
        windowByIdMap,
        focusedAppId,
        openApp,
        closeApp,
        minimizeApp,
        focusApp,
        moveWindow,
        resizeWindow,
        setAppRoute
    ]);

    return (
        <WindowContext.Provider value={value}>
            {children}
        </WindowContext.Provider>
    );
}

export function useWindows(): WindowContextValue
{
    const contextValue = useContext(WindowContext);

    if (!contextValue)
    {
        throw new Error("useWindows must be used within WindowProvider");
    }

    return contextValue;
}
