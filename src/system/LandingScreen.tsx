import { useEffect, useState } from "react";
import { getAssetUrl, profileCopy, profileLinks } from "../content";
import { useI18n } from "../i18n/I18nProvider";
import { Wallpaper } from "./Wallpaper";
import { useView } from "../store/viewStore";
import { LanguageSwitch } from "../components/AppearanceControls";

// -- FUNCTIONS
function getGreetingKey(hourValue: number): string
{
    if (hourValue < 12)
    {
        return "landingGreetingMorning";
    }

    if (hourValue < 18)
    {
        return "landingGreetingAfternoon";
    }

    return "landingGreetingEvening";
}

// -- OPERATIONS
export function LandingScreen()
{
    const { t, localize } = useI18n();
    const { openSimple, openOs } = useView();
    const profile = localize(profileCopy);
    const [now, setNow] = useState(() => new Date());

    useEffect(() =>
    {
        const intervalId = window.setInterval(() => setNow(new Date()), 30_000);

        return () =>
        {
            window.clearInterval(intervalId);
        };
    }, []);

    const clockText = new Intl.DateTimeFormat(t("clockLocale"), {
        hour: "2-digit",
        minute: "2-digit"
    }).format(now);

    const dateText = new Intl.DateTimeFormat(t("clockLocale"), {
        weekday: "long",
        day: "numeric",
        month: "long"
    }).format(now);

    return (
        <div className="relative min-h-[100dvh] overflow-hidden text-ink dark:text-[#FFF7E8]">
            <Wallpaper />
            <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-lg flex-col px-5 pb-8 pt-8 sm:max-w-xl sm:px-8">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-sm capitalize text-ink/70 dark:text-[#FFF7E8]/75">{dateText}</p>
                        <p className="mt-1 font-display text-5xl font-semibold tracking-tight sm:text-6xl">
                            {clockText}
                        </p>
                    </div>
                    <div className="w-36">
                        <LanguageSwitch labelMode="always" />
                    </div>
                </div>

                <div className="mt-auto flex flex-col items-center text-center">
                    <img
                        src={getAssetUrl(profileLinks.avatar ?? "images/origami.svg")}
                        alt=""
                        className="h-28 w-28 rounded-full object-cover shadow-glow ring-2 ring-[#D9772F]/70 sm:h-32 sm:w-32"
                    />
                    <h1 className="mt-5 font-display text-3xl font-semibold sm:text-4xl">
                        {t(getGreetingKey(now.getHours()))},{" "}
                        <span className="text-accent dark:text-[#F2C14B]">{profile.name.split(" ")[0]}</span>
                    </h1>
                    <p className="mt-2 max-w-md text-sm text-ink/75 dark:text-[#FFF7E8]/80 sm:text-base">
                        {t("landingTagline")}
                    </p>

                    <div className="mt-8 flex w-full max-w-md flex-col gap-3">
                        <button
                            type="button"
                            className="rounded-full border border-black/10 bg-white/75 px-5 py-3 text-sm font-semibold tracking-wide text-ink backdrop-blur-md transition hover:border-accent dark:border-white/20 dark:bg-black/35 dark:text-[#FFF7E8]"
                            onClick={openSimple}
                        >
                            {t("landingSimplified")}
                        </button>
                        <p className="-mt-1 text-xs text-ink/55 dark:text-[#FFF7E8]/55">{t("landingSimplifiedHint")}</p>

                        <button
                            type="button"
                            className="rounded-full bg-accent px-5 py-3 text-sm font-semibold tracking-wide text-white shadow-soft transition hover:bg-accentDeep"
                            onClick={openOs}
                        >
                            {t("landingOs")}
                        </button>
                        <p className="-mt-1 text-xs text-ink/55 dark:text-[#FFF7E8]/55">{t("landingOsHint")}</p>
                    </div>
                </div>

                <p className="mt-10 text-center text-xs text-ink/45 dark:text-[#FFF7E8]/45">
                    {profile.role}
                </p>
            </div>
        </div>
    );
}
