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
    favoriteTrackKeyArray: string[];
    skillwaveVolumePercent: number;
};

type SettingsAction =
    | { type: "setTheme"; theme: ThemeMode }
    | { type: "setLanguage"; language: LanguageCode }
    | { type: "setParallaxEnabled"; enabled: boolean }
    | { type: "toggleFavoriteTrack"; trackKey: string }
    | { type: "setSkillwaveVolumePercent"; volumePercent: number }
    | { type: "hydrate"; state: SettingsState }
    | { type: "resetPreferences" };

type SettingsContextValue = SettingsState & {
    setTheme: (theme: ThemeMode) => void;
    setLanguage: (language: LanguageCode) => void;
    setParallaxEnabled: (enabled: boolean) => void;
    toggleFavoriteTrack: (trackKey: string) => void;
    setSkillwaveVolumePercent: (volumePercent: number) => void;
    clearSettings: () => void;
    isTrackFavorite: (trackKey: string) => boolean;
};

// -- CONSTANTS
const STORAGE_KEY = "portfolio-os-settings";

const defaultSettingsState: SettingsState = {
    theme: "dark",
    language: "en",
    parallaxEnabled: true,
    favoriteTrackKeyArray: [],
    skillwaveVolumePercent: 70
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
        case "toggleFavoriteTrack":
            return {
                ...state,
                favoriteTrackKeyArray: toggleId(state.favoriteTrackKeyArray, action.trackKey)
            };
        case "setSkillwaveVolumePercent":
            return {
                ...state,
                skillwaveVolumePercent: Math.max(0, Math.min(100, Math.round(action.volumePercent)))
            };
        case "hydrate":
            return action.state;
        case "resetPreferences":
            return {
                ...state,
                theme: defaultSettingsState.theme,
                language: defaultSettingsState.language,
                parallaxEnabled: defaultSettingsState.parallaxEnabled
            };
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
            favoriteTrackKeyArray: Array.isArray(parsedValue.favoriteTrackKeyArray)
                ? parsedValue.favoriteTrackKeyArray.filter((value) => typeof value === "string")
                : [],
            skillwaveVolumePercent: typeof parsedValue.skillwaveVolumePercent === "number"
                ? Math.max(0, Math.min(100, Math.round(parsedValue.skillwaveVolumePercent)))
                : 70
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
        }, 560);

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

    const toggleFavoriteTrack = useCallback((trackKey: string) =>
    {
        dispatch({ type: "toggleFavoriteTrack", trackKey });
    }, []);

    const setSkillwaveVolumePercent = useCallback((volumePercent: number) =>
    {
        dispatch({ type: "setSkillwaveVolumePercent", volumePercent });
    }, []);

    const clearSettings = useCallback(() =>
    {
        dispatch({ type: "resetPreferences" });
    }, []);

    const value = useMemo<SettingsContextValue>(() => ({
        ...state,
        setTheme,
        setLanguage,
        setParallaxEnabled,
        toggleFavoriteTrack,
        setSkillwaveVolumePercent,
        clearSettings,
        isTrackFavorite: (trackKey: string) => state.favoriteTrackKeyArray.includes(trackKey)
    }), [
        state,
        setTheme,
        setLanguage,
        setParallaxEnabled,
        toggleFavoriteTrack,
        setSkillwaveVolumePercent,
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
