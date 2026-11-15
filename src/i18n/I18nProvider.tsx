import { createContext, useContext, useMemo, type ReactNode } from "react";
import { uiCopy } from "../content/ui";
import type { LanguageCode, LocalizedPair } from "../content/types";
import { useSettings } from "../store/settingsStore";

// -- TYPES
type I18nContextValue = {
    language: LanguageCode;
    t: (key: string) => string;
    localize: <T>(record: LocalizedPair<T>) => T;
};

// -- CONSTANTS
const I18nContext = createContext<I18nContextValue | null>(null);

// -- OPERATIONS
export function I18nProvider({ children }: { children: ReactNode })
{
    const { language } = useSettings();

    const value = useMemo<I18nContextValue>(() => ({
        language,
        t: (key: string) => uiCopy[language][key] ?? uiCopy.en[key] ?? key,
        localize: <T,>(record: LocalizedPair<T>) => record[language]
    }), [language]);

    return (
        <I18nContext.Provider value={value}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n(): I18nContextValue
{
    const contextValue = useContext(I18nContext);

    if (!contextValue)
    {
        throw new Error("useI18n must be used within I18nProvider");
    }

    return contextValue;
}
