import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useReducer,
    useRef,
    type ReactNode
} from "react";
import type { LanguageCode } from "../content/types";

// -- TYPES
export type ThemeMode = "light" | "dark";

type SettingsState = {
    theme: ThemeMode;
    language: LanguageCode;
    parallaxEnabled: boolean;
    favoriteProjectIdArray: string[];
    favoriteTrackKeyArray: string[];
};

type SettingsAction =
    | { type: "setTheme"; theme: ThemeMode }
    | { type: "setLanguage"; language: LanguageCode }
    | { type: "setParallaxEnabled"; enabled: boolean }
    | { type: "toggleFavoriteProject"; projectId: string }
    | { type: "toggleFavoriteTrack"; trackKey: string }
    | { type: "hydrate"; state: SettingsState }
    | { type: "reset" };

type SettingsContextValue = SettingsState & {
    setTheme: (theme: ThemeMode) => void;
    setLanguage: (language: LanguageCode) => void;
    setParallaxEnabled: (enabled: boolean) => void;
    toggleFavoriteProject: (projectId: string) => void;
    toggleFavoriteTrack: (trackKey: string) => void;
    clearSettings: () => void;
    isProjectFavorite: (projectId: string) => boolean;
    isTrackFavorite: (trackKey: string) => boolean;
};

// -- CONSTANTS
const STORAGE_KEY = "portfolio-os-settings";

const defaultSettingsState: SettingsState = {
    theme: "dark",
    language: "en",
    parallaxEnabled: true,
    favoriteProjectIdArray: [],
    favoriteTrackKeyArray: []
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

// -- FUNCTIONS
function toggleId(idArray: string[], id: string): string[]
{
    if (idArray.includes(id))
    {
        return idArray.filter((entryId) => entryId !== id);
    }

    return [...idArray, id];
}

function settingsReducer(state: SettingsState, action: SettingsAction): SettingsState
{
    switch (action.type)
    {
        case "setTheme":
            return { ...state, theme: action.theme };
        case "setLanguage":
            return { ...state, language: action.language };
        case "setParallaxEnabled":
            return { ...state, parallaxEnabled: action.enabled };
        case "toggleFavoriteProject":
            return {
                ...state,
                favoriteProjectIdArray: toggleId(state.favoriteProjectIdArray, action.projectId)
            };
        case "toggleFavoriteTrack":
            return {
                ...state,
                favoriteTrackKeyArray: toggleId(state.favoriteTrackKeyArray, action.trackKey)
            };
        case "hydrate":
            return action.state;
        case "reset":
            return { ...defaultSettingsState };
        default:
            return state;
    }
}

function readStoredSettings(): SettingsState
{
    try
    {
        const rawText = window.localStorage.getItem(STORAGE_KEY);

        if (!rawText)
        {
            return defaultSettingsState;
        }

        const parsedValue = JSON.parse(rawText) as Partial<SettingsState>;

        return {
            theme: parsedValue.theme === "light" ? "light" : "dark",
            language: parsedValue.language === "pt" ? "pt" : "en",
            parallaxEnabled: parsedValue.parallaxEnabled !== false,
            favoriteProjectIdArray: Array.isArray(parsedValue.favoriteProjectIdArray)
                ? parsedValue.favoriteProjectIdArray.filter((value) => typeof value === "string")
                : [],
            favoriteTrackKeyArray: Array.isArray(parsedValue.favoriteTrackKeyArray)
                ? parsedValue.favoriteTrackKeyArray.filter((value) => typeof value === "string")
                : []
        };
    }
    catch
    {
        return defaultSettingsState;
    }
}

// -- OPERATIONS
export function SettingsProvider({ children }: { children: ReactNode })
{
    const [state, dispatch] = useReducer(settingsReducer, defaultSettingsState);
    const previousThemeRef = useRef(state.theme);

    useEffect(() =>
    {
        dispatch({ type: "hydrate", state: readStoredSettings() });
    }, []);

    useEffect(() =>
    {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        document.documentElement.classList.toggle("dark", state.theme === "dark");
        document.documentElement.lang = state.language === "pt" ? "pt-BR" : "en";

        if (previousThemeRef.current === state.theme)
        {
            return;
        }

        previousThemeRef.current = state.theme;
        document.documentElement.classList.add("theme-transition");
        const timeoutId = window.setTimeout(() =>
        {
            document.documentElement.classList.remove("theme-transition");
        }, 420);

        return () =>
        {
            window.clearTimeout(timeoutId);
        };
    }, [state]);

    const setTheme = useCallback((theme: ThemeMode) =>
    {
        dispatch({ type: "setTheme", theme });
    }, []);

    const setLanguage = useCallback((language: LanguageCode) =>
    {
        dispatch({ type: "setLanguage", language });
    }, []);

    const setParallaxEnabled = useCallback((enabled: boolean) =>
    {
        dispatch({ type: "setParallaxEnabled", enabled });
    }, []);

    const toggleFavoriteProject = useCallback((projectId: string) =>
    {
        dispatch({ type: "toggleFavoriteProject", projectId });
    }, []);

    const toggleFavoriteTrack = useCallback((trackKey: string) =>
    {
        dispatch({ type: "toggleFavoriteTrack", trackKey });
    }, []);

    const clearSettings = useCallback(() =>
    {
        window.localStorage.removeItem(STORAGE_KEY);
        dispatch({ type: "reset" });
    }, []);

    const value = useMemo<SettingsContextValue>(() => ({
        ...state,
        setTheme,
        setLanguage,
        setParallaxEnabled,
        toggleFavoriteProject,
        toggleFavoriteTrack,
        clearSettings,
        isProjectFavorite: (projectId: string) => state.favoriteProjectIdArray.includes(projectId),
        isTrackFavorite: (trackKey: string) => state.favoriteTrackKeyArray.includes(trackKey)
    }), [
        state,
        setTheme,
        setLanguage,
        setParallaxEnabled,
        toggleFavoriteProject,
        toggleFavoriteTrack,
        clearSettings
    ]);

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings(): SettingsContextValue
{
    const contextValue = useContext(SettingsContext);

    if (!contextValue)
    {
        throw new Error("useSettings must be used within SettingsProvider");
    }

    return contextValue;
}

export { STORAGE_KEY };
