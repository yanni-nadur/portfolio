import { useIsDesktop } from "../hooks/useMediaQuery";
import { appIdArray } from "./appRegistry";
import { AppWindow } from "./AppWindow";
import { useWindows } from "./windowStore";

// -- OPERATIONS
export function WindowManager()
{
    const { windowByIdMap, focusedAppId } = useWindows();
    const isDesktop = useIsDesktop();

    if (!isDesktop)
    {
        return (
            <>
                {appIdArray.map((appId) =>
                {
                    const windowState = windowByIdMap[appId];

                    if (!windowState.isOpen)
                    {
                        return null;
                    }

                    const isActive = focusedAppId === appId && !windowState.isMinimized;

                    return (
                        <div
                            key={appId}
                            className={isActive ? undefined : "hidden"}
                            aria-hidden={isActive ? undefined : true}
                        >
                            <AppWindow
                                appId={appId}
                                windowState={windowState}
                                isDesktop={false}
                                isFocused={isActive}
                            />
                        </div>
                    );
                })}
            </>
        );
    }

    return (
        <div className="absolute inset-0 overflow-hidden">
            {appIdArray.map((appId) => (
                <AppWindow
                    key={appId}
                    appId={appId}
                    windowState={windowByIdMap[appId]}
                    isDesktop={true}
                    isFocused={focusedAppId === appId}
                />
            ))}
        </div>
    );
}
