import { type ReactNode } from "react";
import {
    getAssetUrl,
    profileCopy,
    profileLinks,
    testimonialArray
} from "../../content";
import type { Testimonial } from "../../content/types";
import { useI18n } from "../../i18n/I18nProvider";
import { type AppId } from "../../system/appRegistry";
import { AppIcon } from "../../system/icons";
import { useWindows } from "../../system/windowStore";

// -- TYPES
type ProfileShortcut = {
    id: string;
    appId: AppId;
    labelKey: string;
};

// -- CONSTANTS
const profileShortcutArray: ProfileShortcut[] = [
    {
        id: "career",
        appId: "calendar",
        labelKey: "contactsCareerShortcut"
    },
    {
        id: "skills",
        appId: "music",
        labelKey: "contactsSkillsShortcut"
    },
    {
        id: "contact",
        appId: "mail",
        labelKey: "contactsContactShortcut"
    }
];

// -- FUNCTIONS
function getQuoteParagraphArray(quoteText: string): string[]
{
    return quoteText
        .split(/\n+/)
        .map((paragraphText) => paragraphText.trim())
        .filter((paragraphText) => paragraphText.length > 0);
}

// -- OPERATIONS
export default function ContactsApp()
{
    const { t, localize } = useI18n();
    const profile = localize(profileCopy);
    const { windowByIdMap, openApp, focusApp, focusedAppId } = useWindows();

    function openOrFocusApp(appId: AppId)
    {
        const windowState = windowByIdMap[appId];

        if (windowState.isOpen && !windowState.isMinimized && focusedAppId === appId)
        {
            return;
        }

        if (windowState.isOpen)
        {
            focusApp(appId);
            return;
        }

        openApp(appId, windowState.route);
    }

    return (
        <div className="profile-app h-full overflow-auto">
            <div className="profile-app-inner">
                <header className="profile-identity">
                    {profileLinks.avatar ? (
                        <img
                            src={getAssetUrl(profileLinks.avatar)}
                            alt=""
                            className="profile-avatar"
                        />
                    ) : (
                        <div className="profile-avatar profile-avatar-fallback" aria-hidden="true">
                            {profile.initials}
                        </div>
                    )}
                    <div className="profile-identity-copy">
                        <h3 className="profile-name font-display">{profile.name}</h3>
                        <p className="profile-role">{profile.role}</p>
                        <p className="profile-availability">
                            <span className="profile-availability-dot" aria-hidden="true" />
                            <span>{profile.statusMessage}</span>
                        </p>
                    </div>
                </header>

                <section className="profile-about" aria-labelledby="profile-about-heading">
                    <h4 id="profile-about-heading" className="profile-section-title font-display">
                        {t("contactsAbout")}
                    </h4>
                    <div className="profile-about-copy">
                        {profile.aboutParagraphArray.map((paragraphText) => (
                            <p key={paragraphText}>{paragraphText}</p>
                        ))}
                    </div>
                </section>

                <nav className="profile-shortcuts" aria-label={t("contactsShortcutsLabel")}>
                    {profileShortcutArray.map((shortcut) =>
                    {
                        const labelText = t(shortcut.labelKey);

                        return (
                            <button
                                key={shortcut.id}
                                type="button"
                                className="profile-shortcut"
                                onClick={() => openOrFocusApp(shortcut.appId)}
                                aria-label={labelText}
                            >
                                <AppIcon appId={shortcut.appId} className="profile-shortcut-icon" />
                                <span className="profile-shortcut-label">{labelText}</span>
                                <span className="profile-shortcut-chevron" aria-hidden="true">
                                    <ChevronIcon />
                                </span>
                            </button>
                        );
                    })}
                </nav>

                <section
                    className="profile-recommendations"
                    aria-labelledby="profile-recommendations-heading"
                >
                    <h4 id="profile-recommendations-heading" className="profile-section-title font-display">
                        {t("contactsRecommendations")}
                    </h4>
                    <ul className="profile-recommendation-grid">
                        {testimonialArray.map((testimonial) => (
                            <li key={testimonial.id}>
                                <RecommendationCard testimonial={testimonial} />
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    );
}

// ~~
type RecommendationCardProps = {
    testimonial: Testimonial;
};

function RecommendationCard({ testimonial }: RecommendationCardProps)
{
    const { localize } = useI18n();
    const localized = localize(testimonial);
    const paragraphArray = getQuoteParagraphArray(localized.quote);

    return (
        <article className="profile-recommendation-card">
            <div className="profile-recommendation-quote-mark" aria-hidden="true">
                "
            </div>
            <div className="profile-recommendation-quote">
                {paragraphArray.map((paragraphText) => (
                    <p key={paragraphText}>{paragraphText}</p>
                ))}
            </div>
            <div className="profile-recommendation-divider" aria-hidden="true" />
            <footer className="profile-recommendation-author">
                <img
                    src={getAssetUrl(testimonial.image)}
                    alt=""
                    className="profile-recommendation-avatar"
                />
                <div className="min-w-0">
                    <p className="profile-recommendation-name">{localized.name}</p>
                    <p className="profile-recommendation-role">{localized.role}</p>
                </div>
            </footer>
        </article>
    );
}

// ~~
function ChevronIcon(): ReactNode
{
    return (
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true" fill="none">
            <path
                d="M6 3.5 10.5 8 6 12.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
