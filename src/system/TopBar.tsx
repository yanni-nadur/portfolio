import { useEffect, useState } from "react";
import { getAssetUrl, profileCopy, profileLinks } from "../content";
import { useI18n } from "../i18n/I18nProvider";
import { useView } from "../store/viewStore";
import { appRegistry } from "./appRegistry";
import { useWindows } from "./windowStore";

// -- OPERATIONS
export function TopBar()
{
    const { t, localize } = useI18n();
    const { focusedAppId } = useWindows();
    const { openLanding } = useView();
    const profile = localize(profileCopy);
    const [now, setNow] = useState(() => new Date());

    useEffect(() =>
    {
        const intervalId = window.setInterval(() =>
        {
            setNow(new Date());
        }, 30_000);

        return () =>
        {
            window.clearInterval(intervalId);
        };
    }, []);

    const activeTitle = focusedAppId
        ? t(appRegistry[focusedAppId].titleKey)
        : t("desktopLabel");

    const clockText = new Intl.DateTimeFormat(t("clockLocale"), {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit"
    }).format(now);

    return (
        <header className="relative z-40 flex h-topbar items-center justify-between gap-4 border-b border-black/10 bg-[#FFF8F4]/75 px-4 text-ink backdrop-blur-md dark:border-white/10 dark:bg-black/55 dark:text-[#FFF7E8]">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <button
                    type="button"
                    className="shrink-0 rounded-full border border-black/10 bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-ink dark:border-white/15 dark:bg-black/20 dark:text-[#FFF7E8]/90"
                    onClick={openLanding}
                >
                    {t("osBackToStart")}
                </button>
                <img
                    src={getAssetUrl(profileLinks.avatar ?? "images/origami.svg")}
                    alt=""
                    className="hidden h-7 w-7 rounded-full object-cover ring-2 ring-[#D9772F]/70 md:block"
                />
                <p className="min-w-0 truncate text-sm tracking-wide">
                    <span className="font-display text-base font-semibold">{profile.name}</span>
                    <span className="mx-2 hidden text-[#E8A0B0]/70 sm:inline">·</span>
                    <span className="hidden font-medium text-ink/75 dark:text-[#FFF7E8]/80 sm:inline">{activeTitle}</span>
                </p>
            </div>
            <time
                className="shrink-0 rounded-full border border-black/10 bg-white/70 px-2.5 py-1 text-xs tabular-nums text-ink dark:border-white/10 dark:bg-black/20 dark:text-[#FFF7E8]/90 sm:px-3"
                dateTime={now.toISOString()}
            >
                {clockText}
            </time>
        </header>
    );
}
