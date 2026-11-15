import { useState } from "react";
import { AppearanceControls } from "../../components/AppearanceControls";
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
    const [didClear, setDidClear] = useState(false);

    return (
        <div className="space-y-8 p-5">
            <section className="space-y-3">
                <h3 className="font-display text-xl font-semibold">{t("settingsAppearance")}</h3>
                <AppearanceControls labelMode="always" />
            </section>

            <section className="space-y-3">
                <h3 className="font-display text-xl font-semibold">{t("settingsMotion")}</h3>
                <label className="flex items-center gap-3 text-sm">
                    <input
                        type="checkbox"
                        checked={parallaxEnabled}
                        onChange={(event) => setParallaxEnabled(event.target.checked)}
                    />
                    <span>{t("settingsParallax")}</span>
                </label>
                {prefersReducedMotion ? (
                    <p className="text-sm text-slateSoft dark:text-white/60">
                        {t("settingsReducedMotion")}
                    </p>
                ) : null}
            </section>

            <section className="space-y-3">
                <h3 className="font-display text-xl font-semibold">{t("settingsData")}</h3>
                <button
                    type="button"
                    className="rounded-lg bg-line/80 px-3 py-2 text-sm font-semibold dark:bg-white/10"
                    onClick={() =>
                    {
                        clearSettings();
                        setDidClear(true);
                    }}
                >
                    {t("settingsClear")}
                </button>
                {didClear ? (
                    <p className="text-sm text-accent">{t("settingsCleared")}</p>
                ) : null}
            </section>
        </div>
    );
}
