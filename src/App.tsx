import { useEffect } from "react";
import { I18nProvider } from "./i18n/I18nProvider";
import { SettingsProvider } from "./store/settingsStore";
import { ViewProvider, useView } from "./store/viewStore";
import { BootScreen } from "./system/BootScreen";
import { DesktopShell } from "./system/DesktopShell";
import { LandingScreen } from "./system/LandingScreen";
import { WindowProvider } from "./system/windowStore";
import { SimplePortfolio } from "./views/SimplePortfolio";

// -- OPERATIONS
function AppRoutes()
{
    const { view } = useView();

    useEffect(() =>
    {
        document.body.classList.toggle("simple-scroll", view === "simple");
        document.body.classList.toggle("landing-scroll", view === "landing");

        return () =>
        {
            document.body.classList.remove("simple-scroll", "landing-scroll");
        };
    }, [view]);

    if (view === "landing")
    {
        return <LandingScreen />;
    }

    if (view === "simple")
    {
        return (
            <>
                <SimplePortfolio />
                <BootScreen key="boot-simple" variant="simple" />
            </>
        );
    }

    return (
        <WindowProvider pathSyncEnabled={true}>
            <DesktopShell />
            <BootScreen key="boot-os" variant="os" />
        </WindowProvider>
    );
}

export function App()
{
    return (
        <SettingsProvider>
            <I18nProvider>
                <ViewProvider>
                    <AppRoutes />
                </ViewProvider>
            </I18nProvider>
        </SettingsProvider>
    );
}
