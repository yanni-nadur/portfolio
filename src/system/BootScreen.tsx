import { useEffect, useRef, useState } from "react";
import { getAssetUrl, profileCopy } from "../content";
import { usePrefersReducedMotion } from "../hooks/useMediaQuery";
import { useI18n } from "../i18n/I18nProvider";
import { useSettings } from "../store/settingsStore";
import { parseAppFromPath } from "./pathRouting";

// -- TYPES
type BootVariant = "os" | "simple";

type BootScreenProps = {
    variant: BootVariant;
};

// -- CONSTANTS
const BOOT_DURATION_MS = 2500;
const BOOT_LEAVE_MS = 420;
const CINEMATIC_BOOT_DURATION_MS = 680;
const CINEMATIC_BOOT_LEAVE_MS = 420;

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
    const { theme } = useSettings();
    const isDeepLinkRef = useRef(parseAppFromPath().appId !== null);
    const profile = localize(profileCopy);
    const stepKeyArray = variant === "os" ? osStepKeyArray : simpleStepKeyArray;
    const isCinematicOsBoot = variant === "os"
        && theme === "dark"
        && !prefersReducedMotion
        && !isDeepLinkRef.current;
    const bootDurationMs = isCinematicOsBoot ? CINEMATIC_BOOT_DURATION_MS : BOOT_DURATION_MS;
    const bootLeaveMs = isCinematicOsBoot ? CINEMATIC_BOOT_LEAVE_MS : BOOT_LEAVE_MS;
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
        }, isCinematicOsBoot ? 220 : 800);
        const secondStepTimeoutId = window.setTimeout(() =>
        {
            setStepIndex(2);
        }, isCinematicOsBoot ? 460 : 1650);
        const leaveTimeoutId = window.setTimeout(() =>
        {
            setIsLeaving(true);
        }, bootDurationMs);
        const hideTimeoutId = window.setTimeout(() =>
        {
            setIsVisible(false);
        }, bootDurationMs + bootLeaveMs);

        return () =>
        {
            window.clearTimeout(firstStepTimeoutId);
            window.clearTimeout(secondStepTimeoutId);
            window.clearTimeout(leaveTimeoutId);
            window.clearTimeout(hideTimeoutId);
        };
    }, [bootDurationMs, bootLeaveMs, isCinematicOsBoot, prefersReducedMotion]);

    useEffect(() =>
    {
        if (!isVisible || isCinematicOsBoot)
        {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () =>
        {
            document.body.style.overflow = previousOverflow;
        };
    }, [isCinematicOsBoot, isVisible]);

    if (isCinematicOsBoot || !isVisible)
    {
        return null;
    }

    return (
        <div
            className={`boot-screen fixed inset-0 z-[60] ${isCinematicOsBoot ? "pointer-events-none boot-screen-cinematic" : ""} ${isLeaving ? "boot-screen-leave" : ""}`}
            role="status"
            aria-live="polite"
            aria-label={t("bootLoading")}
        >
            {isCinematicOsBoot ? (
                <div className="relative z-10 flex justify-center px-6 pt-6">
                    <p className="rounded-full border border-white/15 bg-black/35 px-4 py-2 text-sm text-[#FFF7E8]/90 backdrop-blur-md">
                        {t(stepKeyArray[stepIndex])}
                    </p>
                </div>
            ) : (
                <>
                    <div className="absolute inset-0 sakura-sky dark:hidden" />
                    <div className="absolute inset-0 night-sky hidden dark:block" />
                    <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-ink dark:text-[#FFF7E8]">
                        <div className="boot-logo flex h-20 w-20 items-center justify-center rounded-2xl bg-[#FFF8F4] p-3 shadow-glow ring-2 ring-[#D9772F]/70">
                            <img
                                src={getAssetUrl("images/companies/aurora.webp")}
                                alt=""
                                className="h-full w-full object-contain"
                            />
                        </div>
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
                </>
            )}
        </div>
    );
}
