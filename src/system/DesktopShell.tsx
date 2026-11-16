import { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n/I18nProvider";
import { useIsDesktop, usePrefersReducedMotion } from "../hooks/useMediaQuery";
import { useSettings } from "../store/settingsStore";
import { useWindows } from "./windowStore";
import { Dock } from "./Dock";
import { parseAppFromPath } from "./pathRouting";
import { TopBar } from "./TopBar";
import { Wallpaper } from "./Wallpaper";
import { WindowManager } from "./WindowManager";

// -- CONSTANTS
const OS_INTRO_MS = 2500;
const OS_INTRO_SEEN_KEY = "portfolio-os-intro-seen";

// -- FUNCTIONS
function hasSeenOsIntro(): boolean
{
    try
    {
        return window.sessionStorage.getItem(OS_INTRO_SEEN_KEY) === "1";
    }
    catch
    {
        return false;
    }
}

function markOsIntroSeen(): void
{
    try
    {
        window.sessionStorage.setItem(OS_INTRO_SEEN_KEY, "1");
    }
    catch
    {
        // Private browsing can block session storage.
    }
}

// -- OPERATIONS
export function DesktopShell()
{
    const { t } = useI18n();
    const isDesktop = useIsDesktop();
    const prefersReducedMotion = usePrefersReducedMotion();
    const { theme } = useSettings();
    const { windowByIdMap } = useWindows();
    const playOsIntroRef = useRef<boolean | null>(null);

    if (playOsIntroRef.current === null)
    {
        const shouldPlayIntro = !prefersReducedMotion
            && parseAppFromPath().appId === null
            && !hasSeenOsIntro();
        playOsIntroRef.current = shouldPlayIntro;
    }

    const playOsIntro = playOsIntroRef.current;
    const shouldHoldChrome = playOsIntro && theme === "dark";
    const [isChromeReady, setIsChromeReady] = useState(!shouldHoldChrome);
    const chromeClassName = isChromeReady
        ? (shouldHoldChrome ? "os-chrome-reveal" : "")
        : "os-chrome-wait";

    useEffect(() =>
    {
        if (!shouldHoldChrome)
        {
            setIsChromeReady(true);
            return;
        }

        setIsChromeReady(false);
        const timeoutId = window.setTimeout(() =>
        {
            markOsIntroSeen();
            setIsChromeReady(true);
        }, OS_INTRO_MS);

        return () =>
        {
            window.clearTimeout(timeoutId);
        };
    }, [shouldHoldChrome]);
    const hasOpenApp = Object.values(windowByIdMap).some(
        (windowState) => windowState.isOpen && !windowState.isMinimized
    );

    return (
        <div className="relative h-[100dvh] w-full overflow-hidden text-ink">
            <a className="skip-link" href="#dock">
                {t("skipToDock")}
            </a>
            <Wallpaper variant="os" playOsIntro={playOsIntro} />
            <div className={`relative z-10 flex h-full min-h-0 flex-col ${chromeClassName}`}>
                <TopBar />
                <main
                    className={`relative min-h-0 flex-1 ${isDesktop ? "" : "pb-dock"}`}
                    aria-label={t("desktopLabel")}
                >
                    {!isDesktop && !hasOpenApp ? (
                        <div className="flex h-full items-center justify-center px-6 text-center">
                            <p className="max-w-xs rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-[#FFF7E8]/90 backdrop-blur-md">
                                {t("osHomeHint")}
                            </p>
                        </div>
                    ) : null}
                    <WindowManager />
                </main>
            </div>
            <Dock className={chromeClassName} />
        </div>
    );
}
