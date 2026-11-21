import { useEffect, useState, type ReactNode } from "react";
import { LanguageSwitch, ThemeSwitch } from "../../components/AppearanceControls";
import { useI18n } from "../../i18n/I18nProvider";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";
import { useSettings } from "../../store/settingsStore";

// -- OPERATIONS
export default function SettingsApp()
{
    const { t } = useI18n();
    const {
        parallaxEnabled,
        setParallaxEnabled,
        clearSettings
    } = useSettings();
    const prefersReducedMotion = usePrefersReducedMotion();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [didClear, setDidClear] = useState(false);

    useEffect(() =>
    {
        if (!didClear)
        {
            return;
        }

        const timeoutId = window.setTimeout(() => setDidClear(false), 3200);
        return () => window.clearTimeout(timeoutId);
    }, [didClear]);

    function handleConfirmReset()
    {
        clearSettings();
        setIsConfirmOpen(false);
        setDidClear(true);
    }

    return (
        <div className="prefs-app h-full min-h-0 overflow-auto px-4 py-5 sm:px-5">
            <div className="mx-auto flex max-w-2xl flex-col gap-4">
                <PreferenceSection
                    title={t("settingsAppearance")}
                    description={t("settingsAppearanceDescription")}
                >
                    <ThemeSwitch />
                </PreferenceSection>

                <PreferenceSection
                    title={t("settingsLanguage")}
                    description={t("settingsLanguageDescription")}
                >
                    <LanguageSwitch />
                </PreferenceSection>

                <PreferenceSection title={t("settingsMotion")}>
                    <div className="prefs-row">
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold">{t("settingsParallax")}</p>
                            <p className="mt-1 text-sm leading-relaxed text-slateSoft dark:text-white/60">
                                {t("settingsParallaxDescription")}
                            </p>
                        </div>
                        <PreferenceSwitch
                            checked={parallaxEnabled}
                            label={t("settingsParallax")}
                            onChange={setParallaxEnabled}
                        />
                    </div>
                    {prefersReducedMotion ? (
                        <p className="mt-3 text-sm leading-relaxed text-slateSoft dark:text-white/60">
                            {t("settingsReducedMotion")}
                        </p>
                    ) : null}
                </PreferenceSection>

                <PreferenceSection
                    title={t("settingsData")}
                    description={t("settingsDataDescription")}
                >
                    {isConfirmOpen ? (
                        <div className="prefs-confirm rounded-2xl border border-line/80 p-3 dark:border-white/10">
                            <p className="text-sm font-semibold">{t("settingsClearConfirmTitle")}</p>
                            <p className="mt-1.5 text-sm leading-relaxed text-slateSoft dark:text-white/65">
                                {t("settingsClearConfirmBody")}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-accent px-4 text-sm font-semibold text-white sm:flex-none"
                                    onClick={handleConfirmReset}
                                >
                                    {t("settingsClearConfirm")}
                                </button>
                                <button
                                    type="button"
                                    className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-line/90 px-4 text-sm font-semibold dark:bg-white/10 sm:flex-none"
                                    onClick={() => setIsConfirmOpen(false)}
                                >
                                    {t("settingsClearCancel")}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            type="button"
                            className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-line/90 px-4 text-sm font-semibold transition-colors hover:bg-line dark:bg-white/10 dark:hover:bg-white/15 sm:w-auto"
                            onClick={() =>
                            {
                                setDidClear(false);
                                setIsConfirmOpen(true);
                            }}
                        >
                            {t("settingsClear")}
                        </button>
                    )}
                    {didClear ? (
                        <p className="mt-3 text-sm font-medium text-accent" role="status">
                            {t("settingsCleared")}
                        </p>
                    ) : null}
                </PreferenceSection>
            </div>
        </div>
    );
}

// ~~
function PreferenceSection({
    title,
    description,
    children
}: {
    title: string;
    description?: string;
    children: ReactNode;
})
{
    return (
        <section className="prefs-section">
            <div className="mb-3">
                <h3 className="font-display text-lg font-semibold tracking-tight">{title}</h3>
                {description ? (
                    <p className="mt-1 text-sm leading-relaxed text-slateSoft dark:text-white/60">
                        {description}
                    </p>
                ) : null}
            </div>
            {children}
        </section>
    );
}

function PreferenceSwitch({
    checked,
    label,
    onChange
}: {
    checked: boolean;
    label: string;
    onChange: (enabled: boolean) => void;
})
{
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label}
            className={`prefs-switch ${checked ? "is-on" : ""}`}
            onClick={() => onChange(!checked)}
        >
            <span className="prefs-switch-thumb" aria-hidden="true" />
        </button>
    );
}
