import { useI18n } from "../i18n/I18nProvider";
import { useIsDesktop } from "../hooks/useMediaQuery";
import { useWindows } from "./windowStore";
import { Dock } from "./Dock";
import { TopBar } from "./TopBar";
import { Wallpaper } from "./Wallpaper";
import { WindowManager } from "./WindowManager";

// -- OPERATIONS
export function DesktopShell()
{
    const { t } = useI18n();
    const isDesktop = useIsDesktop();
    const { windowByIdMap } = useWindows();
    const hasOpenApp = Object.values(windowByIdMap).some(
        (windowState) => windowState.isOpen && !windowState.isMinimized
    );

    return (
        <div className="relative h-[100dvh] w-full overflow-hidden text-ink">
            <a className="skip-link" href="#dock">
                {t("skipToDock")}
            </a>
            <Wallpaper />
            <div className="relative z-10 flex h-full min-h-0 flex-col">
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
            <Dock />
        </div>
    );
}
