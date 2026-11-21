import { Suspense, useEffect, useRef } from "react";
import { animated, useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { useI18n } from "../i18n/I18nProvider";
import { usePrefersReducedMotion } from "../hooks/useMediaQuery";
import { appRegistry, type AppId } from "./appRegistry";
import { useWindows, type WindowState } from "./windowStore";

// -- TYPES
type AppWindowProps = {
    appId: AppId;
    windowState: WindowState;
    isDesktop: boolean;
    isFocused: boolean;
};

// -- OPERATIONS
export function AppWindow({ appId, windowState, isDesktop, isFocused }: AppWindowProps)
{
    const { t } = useI18n();
    const { closeApp, toggleMaximizeApp, focusApp, moveWindow, resizeWindow } = useWindows();
    const prefersReducedMotion = usePrefersReducedMotion();
    const containerRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef(false);
    const isResizingRef = useRef(false);
    const definition = appRegistry[appId];
    const titleId = `${appId}-window-title`;
    const AppComponent = definition.Component;
    const canMoveOrResize = isDesktop && !windowState.isMaximized;

    useFocusTrap(containerRef, !isDesktop && windowState.isOpen && !windowState.isMinimized);

    const [springStyle, api] = useSpring(() => ({
        x: windowState.position.x,
        y: windowState.position.y,
        width: windowState.size.width,
        height: windowState.size.height,
        opacity: 1,
        scale: 1,
        config: { tension: 280, friction: 28 },
        immediate: prefersReducedMotion
    }));

    useEffect(() =>
    {
        // Keep live drag/resize spring values; store sync only happens after gesture ends.
        if (isDraggingRef.current || isResizingRef.current)
        {
            return;
        }

        api.start({
            x: windowState.position.x,
            y: windowState.position.y,
            width: windowState.size.width,
            height: windowState.size.height,
            opacity: windowState.isMinimized ? 0 : 1,
            scale: windowState.isMinimized ? 0.92 : 1,
            immediate: prefersReducedMotion
        });
    }, [api, prefersReducedMotion, windowState]);

    const dragBind = useDrag(
        ({ event, offset: [offsetX, offsetY], first, last, memo }) =>
        {
            event.stopPropagation();

            if (!canMoveOrResize)
            {
                return memo;
            }

            if (first)
            {
                isDraggingRef.current = true;
                focusApp(appId);
            }

            api.start({ x: offsetX, y: offsetY, immediate: true });

            if (last)
            {
                moveWindow(appId, { x: offsetX, y: offsetY });
                isDraggingRef.current = false;
            }

            return memo;
        },
        {
            enabled: canMoveOrResize,
            from: () => [windowState.position.x, windowState.position.y],
            bounds: {
                left: 0,
                top: 0,
                right: Math.max(0, window.innerWidth - windowState.size.width - 16),
                bottom: Math.max(0, window.innerHeight - windowState.size.height - 96)
            },
            filterTaps: true
        }
    );

    const resizeBind = useDrag(
        ({ movement: [movementX, movementY], first, memo, last, event }) =>
        {
            event.stopPropagation();

            if (!canMoveOrResize)
            {
                return memo;
            }

            const startSize = first
                ? { ...windowState.size }
                : (memo as { width: number; height: number });

            if (first)
            {
                isResizingRef.current = true;
                focusApp(appId);
            }

            const nextSize = {
                width: Math.max(420, startSize.width + movementX),
                height: Math.max(320, startSize.height + movementY)
            };

            api.start({
                width: nextSize.width,
                height: nextSize.height,
                immediate: true
            });

            if (last)
            {
                resizeWindow(appId, nextSize);
                isResizingRef.current = false;
            }

            return startSize;
        },
        {
            enabled: canMoveOrResize,
            filterTaps: true
        }
    );

    useEffect(() =>
    {
        if (!isFocused || !windowState.isOpen || windowState.isMinimized)
        {
            return;
        }

        function handleKeyDown(event: KeyboardEvent)
        {
            if (event.key === "Escape")
            {
                closeApp(appId);
                const launcherRoot = document.getElementById(isDesktop ? "dock" : "mobile-home");
                launcherRoot
                    ?.querySelector<HTMLButtonElement>(`button[data-app-id="${appId}"]`)
                    ?.focus();
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () =>
        {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [appId, closeApp, isDesktop, isFocused, windowState.isMinimized, windowState.isOpen]);

    if (!windowState.isOpen)
    {
        return null;
    }

    if (!isDesktop)
    {
        return (
            <div
                ref={containerRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                tabIndex={-1}
                className="fixed inset-x-0 bottom-0 top-0 z-40 flex flex-col os-paper text-ink animate-sheet transition-[background,color] duration-[420ms] ease-in-out dark:text-mist pb-[env(safe-area-inset-bottom)]"
            >
                <WindowChrome
                    titleId={titleId}
                    title={t(definition.titleKey)}
                    accent={definition.accent}
                    isDesktop={false}
                    isMaximized={false}
                    onClose={() => closeApp(appId)}
                    onToggleMaximize={() => undefined}
                />
                <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain">
                    <Suspense fallback={<AppLoading />}>
                        <AppComponent />
                    </Suspense>
                </div>
            </div>
        );
    }

    return (
        <animated.div
            ref={containerRef}
            role="dialog"
            aria-modal="false"
            aria-labelledby={titleId}
            className={`absolute overflow-hidden os-paper os-ink-border text-ink transition-[background,box-shadow,color,opacity,border-radius] duration-[420ms] ease-in-out dark:text-mist ${
                windowState.isMaximized ? "rounded-xl" : "rounded-window"
            } ${isFocused ? "ring-1 ring-[#D9772F]/35" : "opacity-95"}`}
            style={{
                x: springStyle.x,
                y: springStyle.y,
                width: springStyle.width,
                height: springStyle.height,
                opacity: springStyle.opacity,
                scale: springStyle.scale,
                zIndex: windowState.zIndex,
                display: windowState.isMinimized ? "none" : "flex",
                flexDirection: "column"
            }}
            onMouseDown={() => focusApp(appId)}
        >
            <div {...dragBind()} className="touch-none select-none">
                <WindowChrome
                    titleId={titleId}
                    title={t(definition.titleKey)}
                    accent={definition.accent}
                    isDesktop={true}
                    isMaximized={windowState.isMaximized}
                    onClose={() => closeApp(appId)}
                    onToggleMaximize={() => toggleMaximizeApp(appId)}
                />
            </div>
            <div className="min-h-0 flex-1 overflow-auto">
                <Suspense fallback={<AppLoading />}>
                    <AppComponent />
                </Suspense>
            </div>
            {canMoveOrResize ? (
                <div
                    {...resizeBind()}
                    className="absolute bottom-1 right-1 h-4 w-4 cursor-se-resize touch-none"
                    aria-hidden="true"
                >
                    <span className="absolute bottom-1 right-1 h-2 w-2 border-b-2 border-r-2 border-ink/30 dark:border-white/40" />
                </div>
            ) : null}
        </animated.div>
    );
}

// ~~
type WindowChromeProps = {
    titleId: string;
    title: string;
    accent: string;
    isDesktop: boolean;
    isMaximized: boolean;
    onClose: () => void;
    onToggleMaximize: () => void;
};

function WindowChrome({
    titleId,
    title,
    accent,
    isDesktop,
    isMaximized,
    onClose,
    onToggleMaximize
}: WindowChromeProps)
{
    const { t } = useI18n();

    return (
        <div
            className="flex h-12 shrink-0 select-none items-center justify-between gap-3 border-b border-line/70 px-3 os-seigaiha transition-[background-color,border-color,color] duration-[420ms] ease-in-out dark:border-white/10"
            style={{ background: `linear-gradient(90deg, ${accent}28, transparent 55%)` }}
        >
            <div className="flex items-center gap-2">
                {isDesktop ? (
                    <>
                        <TrafficButton
                            label={t("closeWindow")}
                            colorClassName="bg-[#E07A5F]"
                            onClick={onClose}
                        />
                        <TrafficButton
                            label={isMaximized ? t("minimizeWindow") : t("maximizeWindow")}
                            colorClassName="bg-[#F2C14B]"
                            onClick={onToggleMaximize}
                        />
                    </>
                ) : (
                    <button
                        type="button"
                        className="rounded-full px-3 py-1 text-sm font-semibold text-accent"
                        onClick={onClose}
                    >
                        {t("back")}
                    </button>
                )}
            </div>
            <h2
                id={titleId}
                className="truncate font-display text-sm font-semibold tracking-wide select-none"
                onDoubleClick={(event) => event.preventDefault()}
            >
                {title}
            </h2>
            <span className="w-16" aria-hidden="true" />
        </div>
    );
}

function TrafficButton({
    label,
    colorClassName,
    onClick
}: {
    label: string;
    colorClassName: string;
    onClick: () => void;
})
{
    return (
        <button
            type="button"
            aria-label={label}
            className={`h-3 w-3 rounded-full ${colorClassName}`}
            onClick={(event) =>
            {
                event.stopPropagation();
                onClick();
            }}
        />
    );
}

function AppLoading()
{
    const { t } = useI18n();

    return (
        <div className="flex h-full items-center justify-center p-8 text-sm text-slateSoft dark:text-white/60">
            {t("loadingApp")}
        </div>
    );
}
