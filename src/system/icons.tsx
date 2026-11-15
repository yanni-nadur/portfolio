import type { JSX } from "react";
import type { AppId } from "./appRegistry";

// -- TYPES
type IconProps = {
    className?: string;
};

// -- FUNCTIONS
function ContactsIcon({ className }: IconProps)
{
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M5 19c1.8-3.2 4.1-4.8 7-4.8S17.2 15.8 19 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    );
}

function CalendarIcon({ className }: IconProps)
{
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3.5" y="5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
            <path d="M8 3.5V7M16 3.5V7M3.5 10h17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    );
}

function PhotosIcon({ className }: IconProps)
{
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3.5" y="5" width="17" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="9" cy="10" r="1.6" fill="currentColor" />
            <path d="M5.5 16.5l4.2-4.2 2.8 2.8 3-3 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function MusicIcon({ className }: IconProps)
{
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 18V7.5l10-2V15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="7" cy="18" r="2.2" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="17" cy="15" r="2.2" stroke="currentColor" strokeWidth="1.6" />
        </svg>
    );
}

function MailIcon({ className }: IconProps)
{
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3.5" y="6" width="17" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
            <path d="M4.5 8l7.5 5 7.5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function SettingsIcon({ className }: IconProps)
{
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
            <path d="M12 3.5v2.2M12 18.3v2.2M4.9 6.5l1.6 1.6M17.5 15.9l1.6 1.6M3.5 12h2.2M18.3 12h2.2M4.9 17.5l1.6-1.6M17.5 8.1l1.6-1.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    );
}

const iconByAppIdMap: Record<AppId, (props: IconProps) => JSX.Element> = {
    contacts: ContactsIcon,
    calendar: CalendarIcon,
    photos: PhotosIcon,
    music: MusicIcon,
    mail: MailIcon,
    settings: SettingsIcon
};

export function AppIcon({ appId, className }: { appId: AppId; className?: string })
{
    const Icon = iconByAppIdMap[appId];
    return <Icon className={className} />;
}
