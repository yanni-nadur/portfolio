import { getAssetUrl } from "../content";
import { usePrefersReducedMotion } from "../hooks/useMediaQuery";
import { useSettings } from "../store/settingsStore";
import type { AppId } from "./appRegistry";

// -- CONSTANTS
const iconFileByAppIdMap: Record<AppId, string> = {
    contacts: "contacts",
    calendar: "experience",
    photos: "gallery",
    music: "music",
    mail: "mail",
    settings: "settings"
};

// -- OPERATIONS
export function AppIcon({ appId, className }: { appId: AppId; className?: string })
{
    const { theme } = useSettings();
    const prefersReducedMotion = usePrefersReducedMotion();
    const isDark = theme === "dark";
    const iconFileName = iconFileByAppIdMap[appId];
    const lightIconPath = getAssetUrl(`images/os-icons/light/${iconFileName}.png`);
    const darkIconPath = getAssetUrl(`images/os-icons/dark/${iconFileName}.png`);
    const fadeClassName = prefersReducedMotion
        ? ""
        : "transition-opacity duration-[560ms] ease-[cubic-bezier(0.22,1,0.36,1)]";

    return (
        <span className={`os-app-icon relative inline-block overflow-visible ${className ?? ""}`}>
            <img
                src={darkIconPath}
                alt=""
                draggable={false}
                className={`pointer-events-none absolute inset-0 h-full w-full select-none object-contain ${fadeClassName} ${
                    isDark ? "opacity-0" : "opacity-100"
                }`}
            />
            <img
                src={lightIconPath}
                alt=""
                draggable={false}
                className={`pointer-events-none absolute inset-0 h-full w-full select-none object-contain ${fadeClassName} ${
                    isDark ? "opacity-100" : "opacity-0"
                }`}
            />
            <img
                src={isDark ? lightIconPath : darkIconPath}
                alt=""
                draggable={false}
                aria-hidden="true"
                className="pointer-events-none invisible h-full w-full select-none object-contain"
            />
        </span>
    );
}
