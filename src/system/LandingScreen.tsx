import { useEffect, useState } from "react";
import { getAssetUrl, profileCopy, profileLinks } from "../content";
import { LanguageSwitch } from "../components/AppearanceControls";
import { useI18n } from "../i18n/I18nProvider";
import { useView } from "../store/viewStore";
import { Wallpaper } from "./Wallpaper";

// -- FUNCTIONS
function PortfolioIcon()
{
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true" fill="none">
            <path
                d="M8 7V5.8A1.8 1.8 0 0 1 9.8 4h4.4A1.8 1.8 0 0 1 16 5.8V7"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
            <rect
                x="4"
                y="7"
                width="16"
                height="13"
                rx="2.2"
                stroke="currentColor"
                strokeWidth="1.6"
            />
            <path
                d="M4 12h16"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
        </svg>
    );
}

function DesktopIcon()
{
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true" fill="none">
            <rect
                x="3.5"
                y="4.5"
                width="17"
                height="12"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.6"
            />
            <path
                d="M8 20h8M12 16.5V20"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
        </svg>
    );
}

function GithubIcon()
{
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="currentColor">
            <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8a9.56 9.56 0 0 1 2.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.86v2.76c0 .26.18.58.69.48A10 10 0 0 0 12 2Z" />
        </svg>
    );
}

function LinkedinIcon()
{
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="currentColor">
            <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5ZM3.5 9.75h2.96V20.5H3.5V9.75Zm5.3 0H11.6v1.46h.04c.43-.81 1.48-1.66 3.05-1.66 3.26 0 3.86 2.15 3.86 4.94V20.5h-2.96v-5.2c0-1.24-.02-2.84-1.73-2.84-1.73 0-2 1.35-2 2.75v5.29H8.8V9.75Z" />
        </svg>
    );
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
        weekday: "short",
        day: "numeric",
        month: "short"
    }).format(now);

    return (
        <div className="relative min-h-[100dvh] overflow-x-hidden text-ink dark:text-[#FFF7E8]">
            <Wallpaper />

            <header className="absolute inset-x-0 top-0 z-20 flex justify-end px-4 pt-4 sm:px-6 sm:pt-5">
                <div className="w-[9.5rem] sm:w-40">
                    <LanguageSwitch />
                </div>
            </header>

            <main className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-xl flex-col justify-center px-5 py-[clamp(4.5rem,9dvh,6rem)] sm:max-w-2xl sm:px-8">
                <div className="landing-hero-enter flex flex-col items-center text-center">
                    <p className="mb-4 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-ink/80 dark:text-[#FFF7E8] sm:mb-5 sm:text-xs">
                        <time dateTime={now.toISOString()}>
                            {dateText}
                            <span aria-hidden="true" className="mx-2 text-accent">·</span>
                            {clockText}
                        </time>
                    </p>

                    <img
                        src={getAssetUrl(profileLinks.avatar ?? "images/origami.svg")}
                        alt={t("landingAvatarAlt")}
                        width={112}
                        height={112}
                        className="h-[5.5rem] w-[5.5rem] rounded-full object-cover shadow-glow ring-2 ring-[#D9772F]/75 sm:h-[7rem] sm:w-[7rem]"
                    />

                    <p className="mt-5 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-ink/80 dark:text-[#FFF7E8] sm:mt-6 sm:text-xs">
                        {t("landingWelcomeLabel")}
                    </p>

                    <h1 className="mt-3 font-display text-[clamp(1.85rem,5.5vw,2.75rem)] font-semibold leading-[1.15] tracking-tight text-ink dark:text-[#FFF7E8]">
                        {t("landingHeadingPrefix")}{" "}
                        <span className="text-accent dark:text-[#F2C14B]">{profile.name}</span>{"."}
                    </h1>

                    <p className="mt-3 text-sm font-medium text-ink dark:text-[#FFF7E8] sm:text-base">
                        {t("landingTitle")}
                    </p>

                    <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/90 dark:text-[#FFF7E8]/95 sm:mt-4 sm:text-[0.95rem]">
                        {t("landingDescription")}
                    </p>

                    <div className="mt-7 flex w-full max-w-sm flex-col gap-3 sm:mt-8">
                        <div className="flex flex-col gap-1.5">
                            <button
                                type="button"
                                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-3 text-sm font-semibold tracking-wide text-white shadow-soft transition hover:bg-accentDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2C14B]"
                                onClick={openSimple}
                            >
                                <PortfolioIcon />
                                {t("landingSimplified")}
                            </button>
                            <p className="px-1 text-xs leading-snug text-ink/80 dark:text-[#FFF7E8]/90">
                                {t("landingSimplifiedHint")}
                            </p>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <button
                                type="button"
                                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-black/15 bg-black/[0.03] px-5 py-3 text-sm font-semibold tracking-wide text-ink transition hover:border-accent/70 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2C14B] dark:border-white/25 dark:bg-black/30 dark:text-[#FFF7E8] dark:hover:border-[#F2C14B]/80 dark:hover:text-[#F2C14B]"
                                onClick={openOs}
                            >
                                <DesktopIcon />
                                {t("landingOs")}
                            </button>
                            <p className="px-1 text-xs leading-snug text-ink/80 dark:text-[#FFF7E8]/90">
                                {t("landingOsHint")}
                            </p>
                        </div>
                    </div>

                    <nav
                        className="mt-6 flex items-center gap-2 sm:mt-7"
                        aria-label={t("simpleContactTitle")}
                    >
                        <a
                            href={profileLinks.github}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-black/5 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2C14B] dark:text-[#FFF7E8] dark:hover:bg-white/10 dark:hover:text-[#F2C14B]"
                            aria-label={t("contactsGithub")}
                        >
                            <GithubIcon />
                        </a>
                        <a
                            href={profileLinks.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-black/5 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2C14B] dark:text-[#FFF7E8] dark:hover:bg-white/10 dark:hover:text-[#F2C14B]"
                            aria-label={t("contactsLinkedin")}
                        >
                            <LinkedinIcon />
                        </a>
                    </nav>
                </div>
            </main>
        </div>
    );
}
