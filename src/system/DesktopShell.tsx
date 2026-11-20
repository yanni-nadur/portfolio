import { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n/I18nProvider";
import { useIsDesktop, usePrefersReducedMotion } from "../hooks/useMediaQuery";
import { useWindows } from "./windowStore";
import { Dock } from "./Dock";
import { MobileHomeScreen } from "./MobileHomeScreen";
import { parseAppFromPath } from "./pathRouting";
import { TopBar } from "./TopBar";
import { Wallpaper } from "./Wallpaper";
import { WindowManager } from "./WindowManager";

// -- CONSTANTS
const OS_INTRO_MS = 2000;
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
    const shouldHoldChrome = Boolean(playOsIntro);
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
            <a className="skip-link" href={isDesktop ? "#dock" : "#mobile-home"}>
                {t(isDesktop ? "skipToDock" : "skipToApps")}
            </a>
            <Wallpaper variant="os" playOsIntro={playOsIntro} />
            <div className={`relative z-10 flex h-full min-h-0 flex-col ${chromeClassName}`}>
                <TopBar />
                <main
                    className="relative min-h-0 flex-1"
                    aria-label={t("desktopLabel")}
                >
                    {!isDesktop && !hasOpenApp ? <MobileHomeScreen /> : null}
                    <WindowManager />
                </main>
            </div>
            {isDesktop ? <Dock className={chromeClassName} /> : null}
        </div>
    );
}
