import { useEffect, useState } from "react";
import { getAssetUrl, profileCopy, profileLinks } from "../content";
import { usePrefersReducedMotion } from "../hooks/useMediaQuery";
import { useI18n } from "../i18n/I18nProvider";

// -- TYPES
type BootVariant = "os" | "simple";

type BootScreenProps = {
    variant: BootVariant;
};

// -- CONSTANTS
const BOOT_DURATION_MS = 2500;
const BOOT_LEAVE_MS = 420;

const osStepKeyArray = [
    "bootOsStep1",
    "bootOsStep2",
    "bootOsStep3"
];

const simpleStepKeyArray = [
    "bootSimpleStep1",
    "bootSimpleStep2",
    "bootSimpleStep3"
];

// -- OPERATIONS
export function BootScreen({ variant }: BootScreenProps)
{
    const { t, localize } = useI18n();
    const prefersReducedMotion = usePrefersReducedMotion();
    const profile = localize(profileCopy);
    const stepKeyArray = variant === "os" ? osStepKeyArray : simpleStepKeyArray;
    const [stepIndex, setStepIndex] = useState(0);
    const [isLeaving, setIsLeaving] = useState(false);
    const [isVisible, setIsVisible] = useState(!prefersReducedMotion);

    useEffect(() =>
    {
        if (prefersReducedMotion)
        {
            setIsVisible(false);
            return;
        }

        const firstStepTimeoutId = window.setTimeout(() =>
        {
            setStepIndex(1);
        }, 800);
        const secondStepTimeoutId = window.setTimeout(() =>
        {
            setStepIndex(2);
        }, 1650);
        const leaveTimeoutId = window.setTimeout(() =>
        {
            setIsLeaving(true);
        }, BOOT_DURATION_MS);
        const hideTimeoutId = window.setTimeout(() =>
        {
            setIsVisible(false);
        }, BOOT_DURATION_MS + BOOT_LEAVE_MS);

        return () =>
        {
            window.clearTimeout(firstStepTimeoutId);
            window.clearTimeout(secondStepTimeoutId);
            window.clearTimeout(leaveTimeoutId);
            window.clearTimeout(hideTimeoutId);
        };
    }, [prefersReducedMotion]);

    useEffect(() =>
    {
        if (!isVisible)
        {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () =>
        {
            document.body.style.overflow = previousOverflow;
        };
    }, [isVisible]);

    if (!isVisible)
    {
        return null;
    }

    return (
        <div
            className={`boot-screen fixed inset-0 z-[60] ${isLeaving ? "boot-screen-leave" : ""}`}
            role="status"
            aria-live="polite"
            aria-label={t("bootLoading")}
        >
            <div className="absolute inset-0 sakura-sky dark:hidden" />
            <div className="absolute inset-0 night-sky hidden dark:block" />
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-ink dark:text-[#FFF7E8]">
                <img
                    src={getAssetUrl(profileLinks.logo)}
                    alt=""
                    className="boot-logo h-20 w-20 rounded-2xl object-cover shadow-glow ring-2 ring-[#D9772F]/70"
                />
                <p className="mt-5 font-display text-3xl font-semibold">
                    {profile.name}
                </p>
                <p className="mt-2 min-h-6 text-sm text-ink/70 dark:text-[#FFF7E8]/75">
                    {t(stepKeyArray[stepIndex])}
                </p>
                <div className="mt-6 h-1.5 w-56 overflow-hidden rounded-full bg-black/10 dark:bg-white/15">
                    <div className="boot-progress-bar h-full rounded-full bg-accent" />
                </div>
            </div>
        </div>
    );
}
