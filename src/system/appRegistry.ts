import { lazy, type ComponentType, type LazyExoticComponent } from "react";

// -- TYPES
export type AppId = "contacts" | "calendar" | "photos" | "music" | "mail" | "settings";

export type AppDefinition = {
    id: AppId;
    titleKey: string;
    accent: string;
    defaultSize: { width: number; height: number };
    Component: LazyExoticComponent<ComponentType>;
};

// -- CONSTANTS
export const appIdArray: AppId[] = [
    "contacts",
    "calendar",
    "photos",
    "music",
    "mail",
    "settings"
];

export const appRegistry: Record<AppId, AppDefinition> = {
    contacts: {
        id: "contacts",
        titleKey: "contactsTitle",
        accent: "#D9772F",
        defaultSize: { width: 820, height: 560 },
        Component: lazy(() => import("../apps/contacts/ContactsApp"))
    },
    calendar: {
        id: "calendar",
        titleKey: "calendarTitle",
        accent: "#3D6B9A",
        defaultSize: { width: 1080, height: 720 },
        Component: lazy(() => import("../apps/calendar/CalendarApp"))
    },
    photos: {
        id: "photos",
        titleKey: "photosTitle",
        accent: "#E8A0B0",
        defaultSize: { width: 960, height: 640 },
        Component: lazy(() => import("../apps/photos/PhotosApp"))
    },
    music: {
        id: "music",
        titleKey: "musicTitle",
        accent: "#7BA3C9",
        defaultSize: { width: 860, height: 600 },
        Component: lazy(() => import("../apps/music/MusicApp"))
    },
    mail: {
        id: "mail",
        titleKey: "mailTitle",
        accent: "#B45309",
        defaultSize: { width: 760, height: 580 },
        Component: lazy(() => import("../apps/mail/MailApp"))
    },
    settings: {
        id: "settings",
        titleKey: "settingsTitle",
        accent: "#5A6574",
        defaultSize: { width: 640, height: 620 },
        Component: lazy(() => import("../apps/settings/SettingsApp"))
    }
};

// -- FUNCTIONS
export function isAppId(value: string): value is AppId
{
    return appIdArray.includes(value as AppId);
}
