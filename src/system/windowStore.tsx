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
    | { type: "syncFromPath"; pathname: string };

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
        case "syncFromPath":
        {
            const parsedPath = parseAppFromPath(action.pathname);

            if (!parsedPath.appId)
            {
                return state;
            }

            const currentWindow = state[parsedPath.appId];

            return {
                ...state,
                [parsedPath.appId]: {
                    ...currentWindow,
                    isOpen: true,
                    isMinimized: false,
                    zIndex: getNextZIndex(state),
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
