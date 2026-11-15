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
        const activeAppId = focusedAppId
            ?? appIdArray.find((appId) => windowByIdMap[appId].isOpen) ?? null;

        if (!activeAppId)
        {
            return null;
        }

        return (
            <AppWindow
                appId={activeAppId}
                windowState={windowByIdMap[activeAppId]}
                isDesktop={false}
                isFocused={true}
            />
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
