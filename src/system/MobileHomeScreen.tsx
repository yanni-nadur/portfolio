import { useRef, type KeyboardEvent } from "react";
import { useI18n } from "../i18n/I18nProvider";
import { appIdArray, appRegistry, type AppId } from "./appRegistry";
import { AppIcon } from "./icons";
import { useWindows } from "./windowStore";

// -- OPERATIONS
export function MobileHomeScreen()
{
    const { t } = useI18n();
    const { windowByIdMap, openApp } = useWindows();
    const buttonRefArray = useRef<Array<HTMLButtonElement | null>>([]);

    function handleOpen(appId: AppId)
    {
        const windowState = windowByIdMap[appId];
        openApp(appId, windowState.route);
    }

    function handleKeyDown(event: KeyboardEvent<HTMLDivElement>)
    {
        const activeIndex = Math.max(
            0,
            buttonRefArray.current.findIndex((element) => element === document.activeElement)
        );

        if (event.key === "ArrowRight")
        {
            event.preventDefault();
            const nextIndex = (activeIndex + 1) % appIdArray.length;
            buttonRefArray.current[nextIndex]?.focus();
        }
        else if (event.key === "ArrowLeft")
        {
            event.preventDefault();
            const previousIndex = (activeIndex - 1 + appIdArray.length) % appIdArray.length;
            buttonRefArray.current[previousIndex]?.focus();
        }
        else if (event.key === "ArrowDown")
        {
            event.preventDefault();
            const nextIndex = Math.min(appIdArray.length - 1, activeIndex + 3);
            buttonRefArray.current[nextIndex]?.focus();
        }
        else if (event.key === "ArrowUp")
        {
            event.preventDefault();
            const previousIndex = Math.max(0, activeIndex - 3);
            buttonRefArray.current[previousIndex]?.focus();
        }
    }

    return (
        <nav
            id="mobile-home"
            className="flex h-full items-center justify-center px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4"
            aria-label={t("osHomeLabel")}
        >
            <div
                role="toolbar"
                aria-orientation="horizontal"
                onKeyDown={handleKeyDown}
                className="grid w-full max-w-sm grid-cols-3 gap-x-4 gap-y-6"
            >
                {appIdArray.map((appId, index) =>
                {
                    const definition = appRegistry[appId];
                    const label = t(definition.titleKey);

                    return (
                        <button
                            key={appId}
                            ref={(element) =>
                            {
                                buttonRefArray.current[index] = element;
                            }}
                            type="button"
                            data-app-id={appId}
                            className="group flex flex-col items-center gap-2 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#F2C14B]"
                            aria-label={label}
                            onClick={() => handleOpen(appId)}
                        >
                            <AppIcon
                                appId={appId}
                                className="os-icon-glow h-16 w-16 transition-transform duration-[560ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-active:scale-[0.98] sm:h-[4.5rem] sm:w-[4.5rem]"
                            />
                            <span className="max-w-[5.5rem] truncate text-center text-xs font-medium text-ink drop-shadow-sm transition-colors duration-[560ms] ease-[cubic-bezier(0.22,1,0.36,1)] dark:text-[#FFF7E8]">
                                {label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
