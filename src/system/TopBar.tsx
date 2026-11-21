import { useEffect, useState } from "react";
import {
    HeaderLanguageSwitch,
    HeaderThemeSwitch,
    StableLocaleText,
    osHeaderClockClassName,
    osHeaderControlClassName
} from "../components/AppearanceControls";
import { uiCopy } from "../content/ui";
import { useI18n } from "../i18n/I18nProvider";
import { useIsDesktop } from "../hooks/useMediaQuery";
import { useView } from "../store/viewStore";
import { formatClockWithWeekday } from "../utils/formatDateTime";

// -- OPERATIONS
export function TopBar()
{
    const { t } = useI18n();
    const { openLanding, openSimple } = useView();
    const isDesktop = useIsDesktop();
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

    const clockText = formatClockWithWeekday(now, t("clockLocale"));
    const clockTextArray = [
        formatClockWithWeekday(now, uiCopy.en.clockLocale),
        formatClockWithWeekday(now, uiCopy.pt.clockLocale)
    ];

    return (
        <header className="relative z-40 flex h-topbar items-center justify-between gap-3 border-b border-black/10 bg-[#FFF8F4]/80 px-3 text-[0.95rem] text-ink backdrop-blur-md transition-[background-color,border-color,color,box-shadow] duration-[560ms] ease-[cubic-bezier(0.22,1,0.36,1)] dark:border-white/10 dark:bg-black/55 dark:text-[#FFF7E8] sm:px-4">
            <p className="min-w-0 truncate font-display text-[1.05rem] font-semibold tracking-wide sm:text-lg">
                {t("osTitle")}
            </p>
            <div className="flex shrink-0 items-center gap-2">
                {isDesktop ? (
                    <>
                        <HeaderThemeSwitch />
                        <HeaderLanguageSwitch />
                        <button
                            type="button"
                            className={osHeaderControlClassName}
                            onClick={openSimple}
                        >
                            <StableLocaleText
                                textArray={[uiCopy.en.osOpenSimple, uiCopy.pt.osOpenSimple]}
                                activeText={t("osOpenSimple")}
                            />
                        </button>
                        <button
                            type="button"
                            className={osHeaderControlClassName}
                            onClick={openLanding}
                        >
                            <StableLocaleText
                                textArray={[uiCopy.en.osBackToStart, uiCopy.pt.osBackToStart]}
                                activeText={t("osBackToStart")}
                            />
                        </button>
                    </>
                ) : (
                    <button
                        type="button"
                        className={osHeaderControlClassName}
                        onClick={openLanding}
                    >
                        <StableLocaleText
                            textArray={[uiCopy.en.osBackToStart, uiCopy.pt.osBackToStart]}
                            activeText={t("osBackToStart")}
                        />
                    </button>
                )}
                <time
                    className={osHeaderClockClassName}
                    dateTime={now.toISOString()}
                >
                    <StableLocaleText textArray={clockTextArray} activeText={clockText} />
                </time>
            </div>
        </header>
    );
}
