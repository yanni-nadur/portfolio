import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useReducer,
    type ReactNode
} from "react";
import { appIdArray, appRegistry, type AppId } from "./appRegistry";
import { buildAppPath, parseAppFromPath, replacePath } from "./pathRouting";

// -- TYPES
export type WindowBounds = {
    position: { x: number; y: number };
    size: { width: number; height: number };
};

export type WindowState = {
    id: AppId;
    isOpen: boolean;
    isMinimized: boolean;
    isMaximized: boolean;
    zIndex: number;
    position: { x: number; y: number };
    size: { width: number; height: number };
    restoreBounds: WindowBounds | null;
    route: string | null;
};

type WindowAction =
    | { type: "open"; appId: AppId; route?: string | null }
    | { type: "close"; appId: AppId }
    | { type: "minimize"; appId: AppId }
    | { type: "toggleMaximize"; appId: AppId }
    | { type: "focus"; appId: AppId }
    | { type: "move"; appId: AppId; position: { x: number; y: number } }
    | { type: "resize"; appId: AppId; size: { width: number; height: number } }
    | { type: "setRoute"; appId: AppId; route: string | null }
    | { type: "syncFromPath"; pathname: string };

type WindowContextValue = {
    windowByIdMap: Record<AppId, WindowState>;
    focusedAppId: AppId | null;
    openApp: (appId: AppId, route?: string | null) => void;
    closeApp: (appId: AppId) => void;
    minimizeApp: (appId: AppId) => void;
    toggleMaximizeApp: (appId: AppId) => void;
    focusApp: (appId: AppId) => void;
    moveWindow: (appId: AppId, position: { x: number; y: number }) => void;
    resizeWindow: (appId: AppId, size: { width: number; height: number }) => void;
    setAppRoute: (appId: AppId, route: string | null) => void;
};

// -- CONSTANTS
const BASE_Z_INDEX = 20;
const TOPBAR_HEIGHT_PX = 48;
const DOCK_RESERVE_PX = 96;
const MAXIMIZE_INSET_PX = 8;
const OPEN_CASCADE_OFFSET_PX = 32;
const WindowContext = createContext<WindowContextValue | null>(null);

// -- FUNCTIONS
function getDesktopAreaSize(): { width: number; height: number }
{
    return {
        width: window.innerWidth,
        height: Math.max(
            320,
            window.innerHeight - TOPBAR_HEIGHT_PX - DOCK_RESERVE_PX
        )
    };
}

function getCenteredPosition(size: { width: number; height: number }): { x: number; y: number }
{
    const desktopArea = getDesktopAreaSize();

    return {
        x: Math.max(0, Math.round((desktopArea.width - size.width) / 2)),
        y: Math.max(0, Math.round((desktopArea.height - size.height) / 2))
    };
}

function getCascadedOpenPosition(
    size: { width: number; height: number },
    anchorWindow: WindowState | null
): { x: number; y: number }
{
    if (!anchorWindow || !anchorWindow.isOpen || anchorWindow.isMinimized)
    {
        return getCenteredPosition(size);
    }

    const desktopArea = getDesktopAreaSize();
    const maxX = Math.max(0, desktopArea.width - size.width);
    const maxY = Math.max(0, desktopArea.height - size.height);

    return {
        x: Math.max(0, Math.min(anchorWindow.position.x + OPEN_CASCADE_OFFSET_PX, maxX)),
        y: Math.max(0, Math.min(anchorWindow.position.y + OPEN_CASCADE_OFFSET_PX, maxY))
    };
}

function getMaximizedBounds(): WindowBounds
{
    return {
        position: {
            x: MAXIMIZE_INSET_PX,
            y: MAXIMIZE_INSET_PX
        },
        size: {
            width: Math.max(420, window.innerWidth - MAXIMIZE_INSET_PX * 2),
            height: Math.max(
                320,
                window.innerHeight - TOPBAR_HEIGHT_PX - DOCK_RESERVE_PX - MAXIMIZE_INSET_PX * 2
            )
        }
    };
}

function createInitialWindow(appId: AppId, cascadeIndex: number): WindowState
{
    const definition = appRegistry[appId];
    const size = { ...definition.defaultSize };

    return {
        id: appId,
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
        zIndex: BASE_Z_INDEX + cascadeIndex,
        position: getCenteredPosition(size),
        size,
        restoreBounds: null,
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

function clearMaximizedState(windowState: WindowState): WindowState
{
    if (!windowState.isMaximized && windowState.restoreBounds === null)
    {
        return windowState;
    }

    return {
        ...windowState,
        isMaximized: false,
        restoreBounds: null
    };
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
            const shouldPlaceWindow = !currentWindow.isOpen;
            const focusedAppId = getFocusedAppId(state);
            const anchorWindow = shouldPlaceWindow
                && focusedAppId
                && focusedAppId !== action.appId
                ? state[focusedAppId]
                : null;

            return {
                ...state,
                [action.appId]: {
                    ...currentWindow,
                    isOpen: true,
                    isMinimized: false,
                    zIndex: getNextZIndex(state),
                    position: shouldPlaceWindow
                        ? getCascadedOpenPosition(currentWindow.size, anchorWindow)
                        : currentWindow.position,
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
                    isMaximized: false,
                    restoreBounds: null,
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
        case "toggleMaximize":
        {
            const currentWindow = state[action.appId];

            if (currentWindow.isMaximized)
            {
                const restoredBounds = currentWindow.restoreBounds ?? {
                    position: currentWindow.position,
                    size: currentWindow.size
                };

                return {
                    ...state,
                    [action.appId]: {
                        ...currentWindow,
                        isMaximized: false,
                        isMinimized: false,
                        position: restoredBounds.position,
                        size: restoredBounds.size,
                        restoreBounds: null,
                        zIndex: getNextZIndex(state)
                    }
                };
            }

            const maximizedBounds = getMaximizedBounds();

            return {
                ...state,
                [action.appId]: {
                    ...currentWindow,
                    isMaximized: true,
                    isMinimized: false,
                    restoreBounds: {
                        position: { ...currentWindow.position },
                        size: { ...currentWindow.size }
                    },
                    position: maximizedBounds.position,
                    size: maximizedBounds.size,
                    zIndex: getNextZIndex(state)
                }
            };
        }
        case "focus":
        {
            const currentWindow = state[action.appId];
            const focusedAppId = getFocusedAppId(state);

            if (
                focusedAppId === action.appId
                && currentWindow.isOpen
                && !currentWindow.isMinimized
            )
            {
                return state;
            }

            return {
                ...state,
                [action.appId]: {
                    ...currentWindow,
                    isOpen: true,
                    isMinimized: false,
                    zIndex: getNextZIndex(state)
                }
            };
        }
        case "move":
            return {
                ...state,
                [action.appId]: {
                    ...clearMaximizedState(state[action.appId]),
                    position: action.position
                }
            };
        case "resize":
            return {
                ...state,
                [action.appId]: {
                    ...clearMaximizedState(state[action.appId]),
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
        case "syncFromPath":
        {
            const parsedPath = parseAppFromPath(action.pathname);

            if (!parsedPath.appId)
            {
                return state;
            }

            const currentWindow = state[parsedPath.appId];
            const shouldCenter = !currentWindow.isOpen;

            return {
                ...state,
                [parsedPath.appId]: {
                    ...currentWindow,
                    isOpen: true,
                    isMinimized: false,
                    zIndex: getNextZIndex(state),
                    position: shouldCenter
                        ? getCenteredPosition(currentWindow.size)
                        : currentWindow.position,
                    route: parsedPath.route
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
    pathSyncEnabled = true
}: {
    children: ReactNode;
    pathSyncEnabled?: boolean;
})
{
    const [windowByIdMap, dispatch] = useReducer(windowReducer, undefined, createInitialWindowMap);
    const focusedAppId = useMemo(() => getFocusedAppId(windowByIdMap), [windowByIdMap]);

    useEffect(() =>
    {
        if (!pathSyncEnabled)
        {
            return;
        }

        function handlePopState()
        {
            dispatch({ type: "syncFromPath", pathname: window.location.pathname });
        }

        handlePopState();
        window.addEventListener("popstate", handlePopState);

        return () =>
        {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [pathSyncEnabled]);

    useEffect(() =>
    {
        if (!pathSyncEnabled)
        {
            return;
        }

        const nextPath = buildAppPath(
            focusedAppId,
            focusedAppId ? windowByIdMap[focusedAppId].route : null
        );

        replacePath(nextPath);
    }, [focusedAppId, pathSyncEnabled, windowByIdMap]);

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

    const toggleMaximizeApp = useCallback((appId: AppId) =>
    {
        dispatch({ type: "toggleMaximize", appId });
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
        toggleMaximizeApp,
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
        toggleMaximizeApp,
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
