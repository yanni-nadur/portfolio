import { useRef, type KeyboardEvent } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useI18n } from "../i18n/I18nProvider";
import { useIsDesktop, usePrefersReducedMotion } from "../hooks/useMediaQuery";
import { appIdArray, appRegistry, type AppId } from "./appRegistry";
import { AppIcon } from "./icons";
import { useWindows } from "./windowStore";

// -- TYPES
type DockProps = {
    className?: string;
};

// -- OPERATIONS
export function Dock({ className = "" }: DockProps)
{
    const { t } = useI18n();
    const { windowByIdMap, openApp, focusApp, focusedAppId } = useWindows();
    const isDesktop = useIsDesktop();
    const prefersReducedMotion = usePrefersReducedMotion();
    const buttonRefArray = useRef<Array<HTMLButtonElement | null>>([]);

    function handleOpen(appId: AppId)
    {
        const windowState = windowByIdMap[appId];

        if (windowState.isOpen && windowState.isMinimized)
        {
            focusApp(appId);
            return;
        }

        if (windowState.isOpen && focusedAppId === appId)
        {
            return;
        }

        openApp(appId, windowState.route);
    }

    function handleKeyDown(event: KeyboardEvent<HTMLDivElement>)
    {
        const activeIndex = Math.max(
            0,
            buttonRefArray.current.findIndex((element) => element === document.activeElement)
        );

        if (event.key === "ArrowRight" || event.key === "ArrowDown")
        {
            event.preventDefault();
            const nextIndex = (activeIndex + 1) % appIdArray.length;
            buttonRefArray.current[nextIndex]?.focus();
        }
        else if (event.key === "ArrowLeft" || event.key === "ArrowUp")
        {
            event.preventDefault();
            const previousIndex = (activeIndex - 1 + appIdArray.length) % appIdArray.length;
            buttonRefArray.current[previousIndex]?.focus();
        }
    }

    return (
        <nav
            id="dock"
            className={`fixed z-50 left-1/2 -translate-x-1/2 ${
                isDesktop
                    ? "bottom-5"
                    : "bottom-0 inset-x-0 translate-x-0 left-0 w-full pb-[env(safe-area-inset-bottom)]"
            } ${className}`}
            aria-label="Dock"
        >
            <div
                role="toolbar"
                aria-orientation="horizontal"
                onKeyDown={handleKeyDown}
                className={`mx-auto flex max-w-full items-end gap-1.5 border border-[#FFF7E8]/18 bg-[#07111F]/45 shadow-glow backdrop-blur-xl sm:gap-2 ${
                    isDesktop
                        ? "dock-pill px-4 py-2.5"
                        : "w-full justify-around rounded-none border-x-0 border-b-0 px-1 pt-2 pb-3"
                }`}
            >
                {appIdArray.map((appId, index) =>
                {
                    const windowState = windowByIdMap[appId];
                    const isActive = windowState.isOpen && !windowState.isMinimized;
                    const isRunning = windowState.isOpen;

                    return (
                        <DockButton
                            key={appId}
                            refCallback={(element) =>
                            {
                                buttonRefArray.current[index] = element;
                            }}
                            appId={appId}
                            label={t(appRegistry[appId].titleKey)}
                            accent={appRegistry[appId].accent}
                            isActive={isActive}
                            isRunning={isRunning}
                            isDesktop={isDesktop}
                            prefersReducedMotion={prefersReducedMotion}
                            onOpen={() => handleOpen(appId)}
                        />
                    );
                })}
            </div>
        </nav>
    );
}

// ~~
type DockButtonProps = {
    appId: AppId;
    label: string;
    accent: string;
    isActive: boolean;
    isRunning: boolean;
    isDesktop: boolean;
    prefersReducedMotion: boolean;
    onOpen: () => void;
    refCallback: (element: HTMLButtonElement | null) => void;
};

function DockButton({
    appId,
    label,
    accent,
    isActive,
    isRunning,
    isDesktop,
    prefersReducedMotion,
    onOpen,
    refCallback
}: DockButtonProps)
{
    const [springStyle, api] = useSpring(() => ({
        scale: 1,
        y: 0,
        config: { tension: 300, friction: 18 },
        immediate: prefersReducedMotion
    }));

    return (
        <animated.button
            ref={refCallback}
            type="button"
            data-app-id={appId}
            className={`group relative flex flex-col items-center gap-1 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#F2C14B] ${
                isDesktop ? "h-14 w-14" : "h-11 w-11 sm:h-12 sm:w-12"
            }`}
            style={{
                scale: springStyle.scale,
                y: springStyle.y
            }}
            aria-label={label}
            aria-current={isActive ? "true" : undefined}
            onClick={onOpen}
            onMouseEnter={() =>
            {
                if (isDesktop && !prefersReducedMotion)
                {
                    api.start({ scale: 1.16, y: -10 });
                }
            }}
            onMouseLeave={() =>
            {
                api.start({ scale: 1, y: 0 });
            }}
        >
            <span
                className="flex h-full w-full items-center justify-center rounded-2xl text-[#FFF7E8] shadow-soft"
                style={{
                    background: `linear-gradient(160deg, ${accent}, #0B1C33 78%)`
                }}
            >
                <AppIcon appId={appId} className="h-6 w-6" />
            </span>
            <span
                className={`h-1.5 w-1.5 rounded-full ${isRunning ? "bg-[#F2C14B]" : "bg-transparent"}`}
                aria-hidden="true"
            />
            <span className="pointer-events-none absolute -top-9 hidden rounded-full border border-white/10 bg-[#07111F]/85 px-2.5 py-0.5 text-xs text-[#FFF7E8] group-hover:lg:block">
                {label}
            </span>
        </animated.button>
    );
}
