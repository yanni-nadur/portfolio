import { useI18n } from "../i18n/I18nProvider";
import { useSettings } from "../store/settingsStore";

// -- FUNCTIONS
function selectionClassName(isSelected: boolean): string
{
    if (isSelected)
    {
        return "bg-accent text-white shadow-soft";
    }

    return "text-slateSoft hover:bg-white/80 dark:text-white/75 dark:hover:bg-white/10";
}

function FlagUnitedStates()
{
    const stripeIndexArray = [1, 3, 5, 7, 9, 11];
    const starArray = [
        { x: 2.2, y: 2.3 },
        { x: 5.4, y: 2.3 },
        { x: 8.6, y: 2.3 },
        { x: 11.8, y: 2.3 },
        { x: 3.8, y: 4.6 },
        { x: 7, y: 4.6 },
        { x: 10.2, y: 4.6 },
        { x: 2.2, y: 6.9 },
        { x: 5.4, y: 6.9 },
        { x: 8.6, y: 6.9 },
        { x: 11.8, y: 6.9 },
        { x: 3.8, y: 9.2 },
        { x: 7, y: 9.2 },
        { x: 10.2, y: 9.2 },
        { x: 2.2, y: 11.5 },
        { x: 5.4, y: 11.5 },
        { x: 8.6, y: 11.5 },
        { x: 11.8, y: 11.5 },
        { x: 3.8, y: 13.8 },
        { x: 7, y: 13.8 },
        { x: 10.2, y: 13.8 }
    ];

    return (
        <span className="inline-flex h-5 w-5 shrink-0 overflow-hidden rounded-full ring-1 ring-black/20">
            <svg viewBox="0 0 32 32" className="h-full w-full" aria-hidden="true">
                <rect width="32" height="32" fill="#B22234" />
                {stripeIndexArray.map((stripeIndex) => (
                    <rect
                        key={stripeIndex}
                        y={(stripeIndex * 32) / 13}
                        width="32"
                        height={(32 / 13) + 0.35}
                        fill="#FFFFFF"
                    />
                ))}
                <rect width="14.2" height="17.3" fill="#3C3B6E" />
                {starArray.map((star) => (
                    <circle
                        key={`${star.x}-${star.y}`}
                        cx={star.x}
                        cy={star.y}
                        r="0.55"
                        fill="#FFFFFF"
                    />
                ))}
            </svg>
        </span>
    );
}

function FlagBrazil()
{
    return (
        <span className="inline-flex h-5 w-5 shrink-0 overflow-hidden rounded-full ring-1 ring-black/20">
            <svg viewBox="0 0 32 32" className="h-full w-full" aria-hidden="true">
                <rect width="32" height="32" fill="#009C3B" />
                <polygon points="16,3.2 29.2,16 16,28.8 2.8,16" fill="#FFDF00" />
                <circle cx="16" cy="16" r="6.3" fill="#002776" />
                <path
                    d="M10.6 17.6c2.4-2.2 8.2-2.6 11.1-.2"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="1.15"
                    strokeLinecap="round"
                />
            </svg>
        </span>
    );
}

function SunIcon()
{
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
            <circle cx="12" cy="12" r="3.2" fill="currentColor" />
            <path
                fill="currentColor"
                d="M11 2h2v3h-2V2Zm0 17h2v3h-2v-3ZM2 11h3v2H2v-2Zm17 0h3v2h-3v-2ZM4.2 5.6l1.4-1.4 2.1 2.1-1.4 1.4-2.1-2.1Zm12.1 12.1 1.4-1.4 2.1 2.1-1.4 1.4-2.1-2.1ZM18.4 4.2l1.4 1.4-2.1 2.1-1.4-1.4 2.1-2.1ZM6.3 16.3l1.4 1.4-2.1 2.1-1.4-1.4 2.1-2.1Z"
            />
        </svg>
    );
}

function MoonIcon()
{
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
            <path
                fill="currentColor"
                d="M14.5 2.4a8.8 8.8 0 1 0 7.1 13.2 7.2 7.2 0 0 1-7.1-11.1 7 7 0 0 0 0-2.1Z"
            />
        </svg>
    );
}

// -- OPERATIONS
function ThemeSwitch()
{
    const { t } = useI18n();
    const { theme, setTheme } = useSettings();

    return (
        <div
            className="grid grid-cols-2 gap-1 rounded-2xl bg-black/5 p-1 dark:bg-white/10"
            role="group"
            aria-label={t("settingsTheme")}
        >
            <button
                type="button"
                className={`flex items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-xs font-semibold ${selectionClassName(theme === "dark")}`}
                aria-pressed={theme === "dark"}
                onClick={() => setTheme("dark")}
            >
                <MoonIcon />
                <span>{t("simpleThemeDark")}</span>
            </button>
            <button
                type="button"
                className={`flex items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-xs font-semibold ${selectionClassName(theme === "light")}`}
                aria-pressed={theme === "light"}
                onClick={() => setTheme("light")}
            >
                <SunIcon />
                <span>{t("simpleThemeLight")}</span>
            </button>
        </div>
    );
}

export function LanguageSwitch()
{
    const { t } = useI18n();
    const { language, setLanguage } = useSettings();

    return (
        <div
            className="grid grid-cols-2 gap-1 rounded-2xl bg-black/5 p-1 dark:bg-white/10"
            role="group"
            aria-label={t("settingsLanguage")}
        >
            <button
                type="button"
                className={`flex items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-xs font-semibold ${selectionClassName(language === "en")}`}
                aria-pressed={language === "en"}
                onClick={() => setLanguage("en")}
            >
                <FlagUnitedStates />
                <span>EN</span>
            </button>
            <button
                type="button"
                className={`flex items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-xs font-semibold ${selectionClassName(language === "pt")}`}
                aria-pressed={language === "pt"}
                onClick={() => setLanguage("pt")}
            >
                <FlagBrazil />
                <span>PT</span>
            </button>
        </div>
    );
}

export function AppearanceControls()
{
    return (
        <div className="space-y-2">
            <ThemeSwitch />
            <LanguageSwitch />
        </div>
    );
}
